import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Minus, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import Constants from "../../../Constants";

function Cart() {
  const [cookies] = useCookies(["token"]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchCartData = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id || !cookies.token) return;

      const res = await axios.get(`${Constants.DOMAIN_API}/cart/user/${user.id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      const items = (res.data.data || []).map((item) => {
        const originalPrice = Number(item.price || 0);
        const salePrice = Number(item.sale_price || 0);
        const finalPrice = salePrice > 0 && salePrice < originalPrice ? salePrice : originalPrice;

        return {
          id: item.id,
          name: item.name || "Sản phẩm",
          image: item.image,
          price: finalPrice,
          original_price: originalPrice,
          sale_price: salePrice,
          quantity: Number(item.quantity || 1),
          color: item.color,
          size: item.size,
          variant_id: item.variant_id,
        };
      });

      setCartItems(items);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  }, [cookies.token]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put(
        `${Constants.DOMAIN_API}/cart/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${cookies.token}` } }
      );

      setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)));
    } catch (err) {
      console.error("Cập nhật số lượng thất bại:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`${Constants.DOMAIN_API}/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      setCartItems((items) => items.filter((item) => item.id !== itemId));
      setSelectedItems((items) => items.filter((id) => id !== itemId));
    } catch (err) {
      console.error("Xóa sản phẩm thất bại:", err);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((current) => (current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId]));
  };

  const handleSelectAll = () => {
    setSelectedItems(selectedItems.length === cartItems.length ? [] : cartItems.map((item) => item.id));
  };

  const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id));
  const total = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Shopping bag</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Giỏ hàng của bạn</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <label className="flex items-center gap-3 font-bold text-ink">
              <input
                type="checkbox"
                checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                onChange={handleSelectAll}
                className="h-4 w-4 accent-clay"
              />
              Chọn tất cả
            </label>
            <span className="text-sm font-semibold text-neutral-500">{cartItems.length} sản phẩm</span>
          </div>

          <div className="divide-y divide-black/10">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <article key={item.id} className="grid gap-4 p-5 md:grid-cols-[auto_110px_1fr_auto] md:items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="h-4 w-4 accent-clay"
                  />
                  <img src={item.image} alt={item.name} className="h-28 w-28 rounded-2xl object-cover" />
                  <div>
                    <h3 className="text-lg font-extrabold text-ink">{item.name}</h3>
                    <p className="mt-2 text-sm text-neutral-500">
                      Màu: {item.color || "N/A"} · Size: {item.size || "N/A"}
                    </p>
                    <p className="mt-3 text-xl font-extrabold text-ink">
                      {Number(item.price).toLocaleString("vi-VN")}đ
                      {item.sale_price > 0 && item.sale_price < item.original_price && (
                        <span className="ml-2 text-sm font-semibold text-neutral-400">
                          {Number(item.original_price).toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-black/10 bg-linen p-1">
                      <button
                        className="grid h-9 w-9 place-items-center rounded-full bg-white"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="grid h-9 w-12 place-items-center font-bold">{item.quantity}</span>
                      <button className="grid h-9 w-9 place-items-center rounded-full bg-white" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="grid h-10 w-10 place-items-center rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                      aria-label="Xóa sản phẩm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-10 text-center text-neutral-500">Giỏ hàng của bạn đang trống.</div>
            )}
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-soft">
          <h2 className="font-display text-3xl font-bold text-ink">Tóm tắt đơn hàng</h2>
          <div className="mt-6 space-y-4 text-sm font-semibold text-neutral-600">
            <div className="flex justify-between">
              <span>Sản phẩm đã chọn</span>
              <span>{selectedItems.length}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-ink">
              <span>Tổng tiền</span>
              <span>{total.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <input className="min-w-0 flex-1 rounded-full border border-black/10 bg-linen px-4 py-3 text-sm outline-none ring-clay/20 focus:ring-4" placeholder="Mã giảm giá" />
            <button className="rounded-full bg-linen px-4 py-3 text-sm font-bold text-clay">Áp dụng</button>
          </div>
          <Link
            to="/payment"
            state={{
              selectedItems: selectedCartItems.map((item) => ({ ...item, cart_id: item.id })),
              total,
            }}
            className={`mt-6 block rounded-full px-6 py-3 text-center font-bold text-white no-underline transition ${
              selectedItems.length ? "bg-ink hover:bg-clay" : "pointer-events-none bg-neutral-300"
            }`}
          >
            Thanh toán
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
