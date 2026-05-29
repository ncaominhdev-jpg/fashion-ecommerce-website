import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Constants from "../../../Constants";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

const ShippingAddressManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(["token"]);
  const [address, setAddress] = useState({
    recipient_name: "",
    address: "",
    phone: "",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);

  const fetchUserAddresses = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/address/user/${user.id}`);
      setAddresses(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách địa chỉ:", err.response?.data || err);
    }
  }, [cookies.token]);

  useEffect(() => {
    fetchUserAddresses();
  }, [fetchUserAddresses]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!address.recipient_name.trim()) errs.recipient_name = "Vui lòng nhập tên người nhận";
    if (!address.address.trim()) errs.address = "Vui lòng nhập địa chỉ";
    if (!address.phone.trim()) {
      errs.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(address.phone.trim())) {
      errs.phone = "Số điện thoại không hợp lệ";
    }
    return errs;
  };

  const handleSave = async () => {
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id || !cookies.token) {
        toast.warning("Vui lòng đăng nhập để lưu địa chỉ.");
        navigate("/login");
        return;
      }

      await axios.post(
        `${Constants.DOMAIN_API}/address/add`,
        { ...address, user_id: user.id },
        {
          headers: { Authorization: `Bearer ${cookies.token}` },
        }
      );

      toast.success("Lưu địa chỉ thành công!");
      await fetchUserAddresses();
      setAddress({ recipient_name: "", address: "", phone: "", note: "" });
      setErrors({});

      if (location.state?.returnTo) {
        navigate(location.state.returnTo, { state: location.state.paymentState });
      }
    } catch (err) {
      console.error("Lỗi lưu địa chỉ:", err);
      toast.error(err.response?.data?.message || "Không thể lưu địa chỉ.");
    }
  };

  const inputClass = "w-full rounded-2xl border border-black/10 bg-linen px-4 py-3 outline-none ring-clay/20 transition focus:ring-4";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Shipping</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Địa chỉ giao hàng</h1>
      </div>

      <section className="rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-display text-2xl font-bold text-ink">Thêm địa chỉ mới</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">Tên người nhận</label>
            <input className={inputClass} name="recipient_name" value={address.recipient_name} onChange={handleChange} />
            {errors.recipient_name && <p className="mt-2 text-sm font-semibold text-red-600">{errors.recipient_name}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Số điện thoại</label>
            <input className={inputClass} name="phone" value={address.phone} onChange={handleChange} />
            {errors.phone && <p className="mt-2 text-sm font-semibold text-red-600">{errors.phone}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">Địa chỉ</label>
            <input className={inputClass} name="address" value={address.address} onChange={handleChange} />
            {errors.address && <p className="mt-2 text-sm font-semibold text-red-600">{errors.address}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">Ghi chú</label>
            <textarea className={`${inputClass} min-h-28`} name="note" value={address.note} onChange={handleChange} />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-clay" onClick={handleSave}>
            Lưu địa chỉ
          </button>
          <button className="rounded-full bg-linen px-6 py-3 font-bold text-ink" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-[2rem] bg-white p-6 shadow-soft md:p-8">
        <h2 className="font-display text-2xl font-bold text-ink">Danh sách địa chỉ đã lưu</h2>
        <div className="mt-5 grid gap-4">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <article key={addr.id} className="rounded-2xl bg-linen p-5">
                <p className="font-extrabold text-ink">Người nhận: {addr.recipient_name}</p>
                <p className="mt-2 text-neutral-600">Địa chỉ: {addr.address}</p>
                <p className="text-neutral-600">Số điện thoại: {addr.phone}</p>
                <p className="text-sm text-neutral-500">Ghi chú: {addr.note || "-"}</p>
              </article>
            ))
          ) : (
            <p className="text-neutral-500">Chưa có địa chỉ nào được lưu.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default ShippingAddressManager;
