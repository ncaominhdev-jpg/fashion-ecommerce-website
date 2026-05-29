import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import Constants from "../../../Constants";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["token"]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState("");
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");

  const subTotal = products.reduce((acc, product) => acc + Number(product.price || 0) * Number(product.quantity || 1), 0);
  const shippingFee = 30000;
  const discount = 0;
  const total = subTotal + shippingFee - discount;

  const fetchUserAddresses = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/address/user/${user.id}`);
      setAddresses(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Lỗi lấy địa chỉ giao hàng:", err.response?.data || err);
      setAddresses([]);
    }
  }, []);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses, location.key]);

  useEffect(() => {
    if (location.state?.selectedItems) {
      setProducts(location.state.selectedItems);
    }
  }, [location.state]);

  useEffect(() => {
    const handleFocus = () => fetchUserAddresses();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchUserAddresses]);

  const handleConfirmPayment = async () => {
    if (selectedAddressIndex === "") {
      toast.warning("Vui lòng chọn địa chỉ nhận hàng!");
      return;
    }
    if (!paymentMethod) {
      toast.warning("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    const selectedAddress = addresses[Number(selectedAddressIndex)];
    const user = JSON.parse(localStorage.getItem("user"));
    const payload = {
      user_id: user.id,
      address_id: selectedAddress.id,
      note: "",
      amount: total,
      payment_method: paymentMethod,
      products: products.map((product) => ({
        variant_id: product.variant_id,
        quantity: product.quantity,
        price: product.price,
      })),
    };

    try {
      await axios.post(`${Constants.DOMAIN_API}/order/add`, payload, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      await Promise.all(
        products
          .filter((product) => product.cart_id)
          .map((product) =>
            axios.delete(`${Constants.DOMAIN_API}/cart/${product.cart_id}`, {
              headers: { Authorization: `Bearer ${cookies.token}` },
            })
          )
      );

      toast.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      toast.error(err.response?.data?.message || "Đặt hàng thất bại");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Checkout</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Thanh toán</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold text-ink">Địa chỉ nhận hàng</h2>
              <button
                className="rounded-full bg-linen px-4 py-2 text-sm font-bold text-clay"
                onClick={() =>
                  navigate("/shipping-address-manager", {
                    state: { returnTo: "/payment", paymentState: location.state },
                  })
                }
              >
                Thêm/Sửa
              </button>
            </div>
            <select
              className="w-full rounded-2xl border border-black/10 bg-linen px-4 py-3 outline-none ring-clay/20 focus:ring-4"
              value={selectedAddressIndex}
              onChange={(e) => setSelectedAddressIndex(e.target.value)}
            >
              <option value="">-- Chọn địa chỉ --</option>
              {addresses.map((addr, index) => (
                <option key={addr.id || index} value={index}>
                  {addr.recipient_name} - {addr.phone} - {addr.address}
                </option>
              ))}
            </select>
            {addresses.length === 0 && (
              <p className="mt-3 text-sm font-semibold text-clay">Bạn chưa có địa chỉ nào. Hãy bấm Thêm/Sửa để tạo địa chỉ nhận hàng.</p>
            )}
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
            <div className="border-b border-black/10 px-6 py-4">
              <h2 className="font-display text-2xl font-bold text-ink">Sản phẩm cần thanh toán</h2>
            </div>
            <div className="divide-y divide-black/10">
              {products.map((product) => (
                <article key={product.id} className="grid gap-4 p-5 sm:grid-cols-[80px_1fr_auto] sm:items-center">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded-2xl object-cover" />
                  <div>
                    <h3 className="font-extrabold text-ink">{product.name}</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Size: {product.size} · Màu: {product.color} · SL: {product.quantity}
                    </p>
                  </div>
                  <p className="font-extrabold text-ink">{Number(product.price).toLocaleString("vi-VN")}đ</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-soft">
          <h2 className="font-display text-3xl font-bold text-ink">Chi tiết thanh toán</h2>
          <div className="mt-6 space-y-4 text-sm font-semibold text-neutral-600">
            <div className="flex justify-between">
              <span>Tổng tiền sản phẩm</span>
              <span>{subTotal.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>{shippingFee.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>{discount.toLocaleString("vi-VN")}đ</span>
            </div>
            <div className="border-t border-black/10 pt-4 text-lg font-extrabold text-ink">
              <div className="flex justify-between">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <h3 className="mb-3 font-bold text-ink">Phương thức thanh toán</h3>
            <div className="space-y-3">
              {[
                { value: "Momo", label: "Thanh toán online" },
                { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
              ].map((method) => (
                <label key={method.value} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-linen px-4 py-3 font-semibold">
                  <input
                    type="radio"
                    name="payment_method"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-4 w-4 accent-clay"
                  />
                  {method.label}
                </label>
              ))}
            </div>
          </div>

          <button className="mt-7 w-full rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-clay" onClick={handleConfirmPayment}>
            Xác nhận thanh toán
          </button>
        </aside>
      </div>
    </main>
  );
};

export default Payment;
