import axios from "axios";
import { useForm } from "react-hook-form";
import Constants from "../../../Constants";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["token", "role"]);
  const { handleSubmit, register, formState: { errors }, setError } = useForm();

  const handleLogin = async ({ email, password }) => {
    try {
      const res = await axios.post(`${Constants.DOMAIN_API}/user/login`, { email, password });
      const { token, user } = res.data;
      const expiresDate = new Date();
      expiresDate.setHours(expiresDate.getHours() + 10);

      setCookie("token", token, { expires: expiresDate, path: "/" });
      setCookie("role", `${user.role}`, { expires: expiresDate, path: "/" });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "";
      if (message === "Email không tồn tại") {
        setError("email", { type: "manual", message: "Email không tồn tại trong hệ thống" });
      } else if (message === "Sai mật khẩu") {
        setError("password", { type: "manual", message: "Mật khẩu không chính xác" });
      } else {
        setError("password", { type: "manual", message: "Đăng nhập thất bại, vui lòng thử lại" });
      }
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-84px)] place-items-center bg-linen px-4 py-16">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-lift lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-end">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-champagne">Welcome back</p>
          <h1 className="mt-4 font-display text-5xl font-bold">Đăng nhập Poly Fashion</h1>
          <p className="mt-5 text-white/70">Theo dõi đơn hàng, lưu thông tin mua sắm và nhận ưu đãi dành riêng cho thành viên.</p>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="font-display text-4xl font-bold text-ink">Đăng nhập</h2>
          <form onSubmit={handleSubmit(handleLogin)} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-ink">Email</label>
              <input
                type="email"
                className="w-full rounded-2xl border border-black/10 bg-linen px-4 py-3 outline-none ring-clay/20 transition focus:ring-4"
                placeholder="Nhập email"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: { value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, message: "Email không hợp lệ" },
                })}
              />
              {errors.email && <p className="mt-2 text-sm font-semibold text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-ink">Mật khẩu</label>
              <input
                type="password"
                className="w-full rounded-2xl border border-black/10 bg-linen px-4 py-3 outline-none ring-clay/20 transition focus:ring-4"
                placeholder="Nhập mật khẩu"
                {...register("password", { required: "Vui lòng nhập mật khẩu" })}
              />
              {errors.password && <p className="mt-2 text-sm font-semibold text-red-600">{errors.password.message}</p>}
            </div>

            <button type="submit" className="w-full rounded-full bg-ink px-6 py-3 font-bold text-white transition hover:bg-clay">
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
            <Link to="/forgot-password" className="font-semibold text-clay">Quên mật khẩu?</Link>
            <p className="text-neutral-600">Chưa có tài khoản? <Link to="/register" className="font-bold text-ink">Đăng ký ngay</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
