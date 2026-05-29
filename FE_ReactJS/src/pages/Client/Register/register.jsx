import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Constants from "../../../Constants";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, getValues, setError } = useForm();

  const onSubmit = async (data) => {
    try {
      await axios.post(`${Constants.DOMAIN_API}/user/register`, data);
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === "Email đã tồn tại") {
        setError("email", { type: "manual", message: "Email đã tồn tại. Vui lòng chọn email khác" });
      } else {
        console.error("Lỗi đăng ký:", err);
      }
    }
  };

  const inputClass = "w-full rounded-2xl border border-black/10 bg-linen px-4 py-3 outline-none ring-clay/20 transition focus:ring-4";

  return (
    <main className="grid min-h-[calc(100vh-84px)] place-items-center bg-linen px-4 py-16">
      <section className="w-full max-w-3xl rounded-[2rem] bg-white p-8 shadow-lift sm:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Create account</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">Đăng ký thành viên</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">Họ và tên</label>
            <input type="text" className={inputClass} placeholder="Nhập họ và tên" {...register("name", { required: "Vui lòng nhập họ tên", minLength: { value: 2, message: "Ít nhất 2 ký tự" } })} />
            {errors.name && <p className="mt-2 text-sm font-semibold text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Email</label>
            <input type="email" className={inputClass} placeholder="Nhập email" {...register("email", { required: "Vui lòng nhập email", pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Email không hợp lệ" } })} />
            {errors.email && <p className="mt-2 text-sm font-semibold text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Số điện thoại</label>
            <input type="text" className={inputClass} placeholder="Nhập số điện thoại" {...register("phone", { required: "Vui lòng nhập số điện thoại", pattern: { value: /^[0-9]{10}$/, message: "Số điện thoại phải đúng 10 số" } })} />
            {errors.phone && <p className="mt-2 text-sm font-semibold text-red-600">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Mật khẩu</label>
            <input type="password" className={inputClass} placeholder="Nhập mật khẩu" {...register("password", { required: "Vui lòng nhập mật khẩu", minLength: { value: 6, message: "Ít nhất 6 ký tự" } })} />
            {errors.password && <p className="mt-2 text-sm font-semibold text-red-600">{errors.password.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold">Xác nhận mật khẩu</label>
            <input type="password" className={inputClass} placeholder="Nhập lại mật khẩu" {...register("confirmPassword", { required: "Vui lòng xác nhận mật khẩu", validate: (value) => value === getValues("password") || "Mật khẩu xác nhận không khớp" })} />
            {errors.confirmPassword && <p className="mt-2 text-sm font-semibold text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-clay md:col-span-2">Đăng ký</button>
          <p className="text-center text-sm text-neutral-600 md:col-span-2">Đã có tài khoản? <Link to="/login" className="font-bold text-ink">Đăng nhập ngay</Link></p>
        </form>
      </section>
    </main>
  );
};

export default Register;
