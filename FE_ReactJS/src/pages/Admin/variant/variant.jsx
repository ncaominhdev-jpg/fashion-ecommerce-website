import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import HeaderAdmin from "../layout/header";
import constant from "../../../Constants";

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";
const labelClass = "text-sm font-bold text-neutral-800";
const emptyForm = { product_id: "", size_id: "", color_id: "", stock: "" };

const Variant = () => {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [editingVariant, setEditingVariant] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productById = useMemo(() => new Map(products.map((item) => [Number(item.id), item])), [products]);
  const sizeById = useMemo(() => new Map(sizes.map((item) => [Number(item.id), item])), [sizes]);
  const colorById = useMemo(() => new Map(colors.map((item) => [Number(item.id), item])), [colors]);
  const isModalOpen = Boolean(modalMode);

  const fetchAll = async () => {
    try {
      const [variantRes, productRes, sizeRes, colorRes] = await Promise.all([
        axios.get(`${constant.DOMAIN_API}/variant/list`),
        axios.get(`${constant.DOMAIN_API}/product/list`),
        axios.get(`${constant.DOMAIN_API}/size/list`),
        axios.get(`${constant.DOMAIN_API}/color/list`),
      ]);

      setVariants(variantRes.data.data || []);
      setProducts(productRes.data.data || []);
      setSizes(sizeRes.data.data || []);
      setColors(colorRes.data.data || []);
    } catch (error) {
      console.error("Lỗi khi tải biến thể:", error);
      toast.error("Không thể tải dữ liệu biến thể");
    }
  };

  const openAddModal = () => {
    setEditingVariant(null);
    setFormData(emptyForm);
    setModalMode("add");
  };

  const openEditModal = (variant) => {
    setEditingVariant(variant);
    setFormData({
      product_id: variant.product_id || "",
      size_id: variant.size_id || "",
      color_id: variant.color_id || "",
      stock: variant.stock ?? "",
    });
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingVariant(null);
    setFormData(emptyForm);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.product_id || !formData.size_id || !formData.color_id) {
      toast.warning("Vui lòng chọn sản phẩm, size và màu");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = Cookies.get(constant.COOKIE_TOKEN);
      const payload = {
        product_id: formData.product_id,
        size_id: formData.size_id,
        color_id: formData.color_id,
        stock: formData.stock || 0,
      };

      if (modalMode === "edit" && editingVariant?.id) {
        await axios.put(`${constant.DOMAIN_API}/variant/${editingVariant.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật biến thể thành công");
      } else {
        await axios.post(`${constant.DOMAIN_API}/variant/add`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm biến thể thành công");
      }

      await fetchAll();
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu biến thể:", error.response?.data || error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Không thể lưu biến thể");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (variant) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa biến thể này?")) return;

    try {
      const token = Cookies.get(constant.COOKIE_TOKEN);
      await axios.delete(`${constant.DOMAIN_API}/variant/${variant.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa biến thể thành công");
      fetchAll();
    } catch (error) {
      console.error("Lỗi khi xóa biến thể:", error);
      toast.error("Xóa biến thể thất bại");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Inventory</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Biến thể sản phẩm</h1>
            <p className="mt-2 text-sm text-neutral-500">Quản lý size, màu và tồn kho riêng cho từng sản phẩm.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-neutral-900/20 transition hover:bg-amber-600"
          >
            <Plus size={18} />
            Thêm biến thể
          </button>
        </div>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Sản phẩm</th>
                  <th className="px-6 py-4 font-bold">Size</th>
                  <th className="px-6 py-4 font-bold">Màu</th>
                  <th className="px-6 py-4 font-bold">Tồn kho</th>
                  <th className="px-6 py-4 text-right font-bold">Hoạt động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {variants.length > 0 ? (
                  variants.map((variant) => {
                    const product = productById.get(Number(variant.product_id));
                    const size = sizeById.get(Number(variant.size_id));
                    const color = colorById.get(Number(variant.color_id));

                    return (
                      <tr key={variant.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 font-semibold text-neutral-500">#{variant.id}</td>
                        <td className="px-6 py-4 font-bold text-neutral-950">{product?.name || `SP #${variant.product_id}`}</td>
                        <td className="px-6 py-4 text-neutral-700">{size?.size_label || `Size #${variant.size_id}`}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-3 font-semibold text-neutral-700">
                            <span
                              className="h-7 w-7 rounded-full border border-neutral-200"
                              style={{ backgroundColor: color?.color_code || "#fff" }}
                            />
                            {color?.color_name || `Màu #${variant.color_id}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-neutral-950">{variant.stock}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(variant)}
                              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                            >
                              <Pencil size={14} />
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(variant)}
                              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                            >
                              <Trash2 size={14} />
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-neutral-500">
                      Chưa có biến thể nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/30 px-4 py-4" onMouseDown={closeModal}>
          <aside
            className="ml-auto max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Inventory</p>
                <h2 className="mt-2 text-2xl font-bold text-neutral-950">
                  {modalMode === "edit" ? "Sửa biến thể" : "Thêm biến thể"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-neutral-950 hover:text-neutral-950"
                aria-label="Đóng modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass} htmlFor="product_id">Sản phẩm</label>
                <select id="product_id" name="product_id" className={inputClass} value={formData.product_id} onChange={handleInputChange}>
                  <option value="">-- Chọn sản phẩm --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="size_id">Size</label>
                <select id="size_id" name="size_id" className={inputClass} value={formData.size_id} onChange={handleInputChange}>
                  <option value="">-- Chọn size --</option>
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>{size.size_label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="color_id">Màu sắc</label>
                <select id="color_id" name="color_id" className={inputClass} value={formData.color_id} onChange={handleInputChange}>
                  <option value="">-- Chọn màu --</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>{color.color_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="stock">Tồn kho</label>
                <input id="stock" name="stock" type="number" min="0" className={inputClass} value={formData.stock} onChange={handleInputChange} />
              </div>

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu biến thể"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex flex-1 items-center justify-center rounded-full border border-neutral-200 px-5 py-3 text-sm font-bold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                >
                  Hủy
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Variant;
