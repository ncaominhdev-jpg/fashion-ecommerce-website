import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import constant from "../../../../../Constants";
import HeaderAdmin from "../../layout/header";

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";
const labelClass = "text-sm font-bold text-neutral-800";

const getToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${constant.COOKIE_TOKEN}=`))
    ?.split("=")[1];

const uploadImageToCloudinary = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", constant.UPLOAD_PRESET);

  const res = await axios.post(`https://api.cloudinary.com/v1_1/${constant.CLOUD_NAME}/image/upload`, formData);
  return res.data.secure_url;
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sale_price: "",
    stock: "",
    category_id: "",
    brand_id: "",
    target_group_id: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${constant.DOMAIN_API}/category/list`);
        setCategories(res.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    axios
      .get(`${constant.DOMAIN_API}/product/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        const { data } = response.data;
        setProduct(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          sale_price: data.sale_price || "",
          stock: data.stock || "",
          category_id: data.category_id || "",
          brand_id: data.brand_id || "",
          target_group_id: data.target_group_id || "",
        });
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        toast.error("Không thể tải sản phẩm");
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const imageUrl = newImage ? await uploadImageToCloudinary(newImage) : "";

      await axios.put(
        `${constant.DOMAIN_API}/product/${id}`,
        {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          sale_price: formData.sale_price || 0,
          stock: formData.stock || 0,
          category_id: formData.category_id,
          brand_id: formData.brand_id || 1,
          target_group_id: formData.target_group_id || 1,
          ...(imageUrl ? { image: imageUrl } : {}),
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      toast.success("Cập nhật sản phẩm thành công");
      navigate("/admin/product");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data || error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Cập nhật sản phẩm thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <HeaderAdmin />
        <main className="px-5 py-8 lg:ml-72 lg:px-10">
          <div className="rounded-3xl border border-neutral-200 bg-white px-6 py-12 text-center text-neutral-500 shadow-sm">
            Đang tải sản phẩm...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Inventory</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Chỉnh sửa sản phẩm</h1>
            <p className="mt-2 text-sm text-neutral-500">Cập nhật thông tin sản phẩm đang bán.</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="name">
                  Tên sản phẩm
                </label>
                <input id="name" name="name" className={inputClass} value={formData.name} onChange={handleInputChange} />
              </div>

              <div>
                <label className={labelClass} htmlFor="price">
                  Giá
                </label>
                <input type="number" id="price" name="price" className={inputClass} value={formData.price} onChange={handleInputChange} />
              </div>

              <div>
                <label className={labelClass} htmlFor="category_id">
                  Danh mục
                </label>
                <select name="category_id" id="category_id" className={inputClass} value={formData.category_id} onChange={handleInputChange}>
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass} htmlFor="image">
                  Hình ảnh mới
                </label>
                <input type="file" id="image" name="image" className={inputClass} accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} />
                <p className="mt-2 text-sm font-semibold text-neutral-500">
                  {newImage ? "Ảnh mới sẽ được upload lên Cloudinary." : "Không chọn ảnh mới thì giữ ảnh Cloudinary hiện tại."}
                </p>
              </div>
            </div>

            {product.image && (
              <div className="mt-5">
                <label className={labelClass}>Ảnh hiện tại</label>
                <img src={product.image} alt={product.name} className="mt-2 h-32 w-32 rounded-2xl object-cover" />
              </div>
            )}

            <div className="mt-5">
              <label className={labelClass} htmlFor="description">
                Mô tả
              </label>
              <textarea id="description" name="description" rows={5} className={inputClass} value={formData.description} onChange={handleInputChange} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
              </button>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                onClick={() => navigate("/admin/product")}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditProduct;
