import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import constant from "../../../../../Constants";
import HeaderAdmin from "../../layout/header";

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";
const labelClass = "text-sm font-bold text-neutral-800";
const errorClass = "mt-2 text-sm font-semibold text-rose-600";

const uploadImageToCloudinary = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", constant.UPLOAD_PRESET);

  const res = await axios.post(`https://api.cloudinary.com/v1_1/${constant.CLOUD_NAME}/image/upload`, formData);
  return res.data.secure_url;
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${constant.DOMAIN_API}/category/list`);
        const activeCategories = (res.data.data || []).filter((category) => category.status === "active");
        setCategories(activeCategories);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const imageUrl = await uploadImageToCloudinary(image);
      const token = Cookies.get(constant.COOKIE_TOKEN);

      await axios.post(
        `${constant.DOMAIN_API}/product/add`,
        {
          name: data.name,
          description: data.description,
          price: data.price,
          sale_price: data.sale_price || 0,
          stock: data.stock || 0,
          category_id: data.category_id,
          brand_id: data.brand_id || 1,
          target_group_id: data.target_group_id || 1,
          image: imageUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Thêm sản phẩm thành công!");
      navigate("/admin/product");
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error.response?.data || error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Có lỗi xảy ra khi thêm sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Inventory</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Thêm sản phẩm</h1>
            <p className="mt-2 text-sm text-neutral-500">Nhập thông tin sản phẩm mới cho cửa hàng thời trang.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Tên sản phẩm</label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Ví dụ: Áo blazer linen"
                  {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Giá</label>
                <input
                  type="number"
                  step="0.01"
                  className={inputClass}
                  placeholder="1200000"
                  {...register("price", {
                    required: "Giá là bắt buộc",
                    pattern: {
                      value: /^[0-9]+(\.[0-9]{1,2})?$/,
                      message: "Giá phải là số hợp lệ",
                    },
                  })}
                />
                {errors.price && <p className={errorClass}>{errors.price.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Ảnh</label>
                <input type="file" accept="image/*" className={inputClass} onChange={(e) => setImage(e.target.files?.[0] || null)} />
                {image && <p className="mt-2 text-sm font-semibold text-neutral-500">Ảnh sẽ được upload lên Cloudinary.</p>}
              </div>

              <div>
                <label className={labelClass}>Danh mục</label>
                <select className={inputClass} {...register("category_id", { required: "Danh mục là bắt buộc" })}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className={errorClass}>{errors.category_id.message}</p>}
              </div>
            </div>

            <div className="mt-5">
              <label className={labelClass}>Mô tả</label>
              <textarea
                rows={5}
                className={inputClass}
                placeholder="Mô tả chất liệu, kiểu dáng và điểm nổi bật..."
                {...register("description", { required: "Mô tả là bắt buộc" })}
              />
              {errors.description && <p className={errorClass}>{errors.description.message}</p>}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Đang lưu..." : "Thêm sản phẩm"}
              </button>
              <Link
                to="/admin/product"
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

export default AddProduct;
