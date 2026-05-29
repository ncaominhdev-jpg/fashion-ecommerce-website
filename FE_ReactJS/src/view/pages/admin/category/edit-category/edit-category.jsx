import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import HeaderAdmin from "../../layout/header";
import constant from "../../../../../Constants.jsx";

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";
const labelClass = "text-sm font-bold text-neutral-800";
const errorClass = "mt-2 text-sm font-semibold text-rose-600";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const token = Cookies.get(constant.COOKIE_TOKEN);
        const res = await axios.get(`${constant.DOMAIN_API}/category/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        reset(res.data.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin danh mục:", error);
        toast.error("Không thể tải danh mục");
      }
    };

    fetchCategory();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const token = Cookies.get(constant.COOKIE_TOKEN);
      await axios.put(`${constant.DOMAIN_API}/category/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cập nhật danh mục thành công!");
      navigate("/admin/categories");
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      toast.error("Có lỗi xảy ra khi cập nhật danh mục");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Catalog</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Chỉnh sửa loại sản phẩm</h1>
            <p className="mt-2 text-sm text-neutral-500">Cập nhật tên và trạng thái kinh doanh của danh mục.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <div>
              <label className={labelClass} htmlFor="name">
                Tên loại
              </label>
              <input
                type="text"
                id="name"
                className={inputClass}
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
                {...register("status", { required: "Trạng thái là bắt buộc" })}
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
                Lưu thay đổi
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

export default EditCategory;
