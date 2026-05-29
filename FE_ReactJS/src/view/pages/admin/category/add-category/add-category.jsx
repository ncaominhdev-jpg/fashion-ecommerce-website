import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import HeaderAdmin from "../../layout/header";
import constant from "../../../../../Constants.jsx";

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";
const labelClass = "text-sm font-bold text-neutral-800";
const errorClass = "mt-2 text-sm font-semibold text-rose-600";

const AddCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get(constant.COOKIE_TOKEN);
      await axios.post(`${constant.DOMAIN_API}/category/add`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Thêm danh mục thành công!");
      navigate("/admin/categories");
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
      toast.error("Có lỗi xảy ra khi thêm danh mục");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Catalog</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Thêm loại sản phẩm</h1>
            <p className="mt-2 text-sm text-neutral-500">Tạo danh mục mới để nhóm sản phẩm trên website.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <div>
              <label className={labelClass} htmlFor="name">
                Tên loại
              </label>
              <input
                id="name"
                type="text"
                className={inputClass}
                placeholder="Ví dụ: Áo khoác, Giày sneaker..."
                {...register("name", { required: "Tên loại là bắt buộc" })}
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            <div className="mt-5">
              <label className={labelClass} htmlFor="status">
                Trạng thái
              </label>
              <select
                id="status"
                className={inputClass}
                {...register("status", { required: "Vui lòng chọn trạng thái" })}
              >
                <option value="">-- Chọn trạng thái --</option>
                <option value="active">Đang kinh doanh</option>
                <option value="inactive">Ngừng kinh doanh</option>
              </select>
              {errors.status && <p className={errorClass}>{errors.status.message}</p>}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600"
              >
                Lưu danh mục
              </button>
              <Link
                to="/admin/categories"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 no-underline transition hover:border-neutral-950 hover:text-neutral-950"
              >
                Hủy
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddCategory;
