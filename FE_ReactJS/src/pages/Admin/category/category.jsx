import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import HeaderAdmin from "../layout/header";
import constant from "../../../Constants";

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";
const labelClass = "text-sm font-bold text-neutral-800";
const errorClass = "mt-2 text-sm font-semibold text-rose-600";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      status: "active",
    },
  });

  const isModalOpen = Boolean(modalMode);

  const fetchCategories = () => {
    axios
      .get(`${constant.DOMAIN_API}/category/list`)
      .then((res) => {
        if (res.data?.data) setCategories(res.data.data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh mục:", err);
      });
  };

  const openAddModal = () => {
    setEditingCategory(null);
    reset({ name: "", status: "active" });
    setModalMode("add");
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    reset({
      name: category.name || "",
      status: category.status || "active",
    });
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingCategory(null);
    reset({ name: "", status: "active" });
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const token = Cookies.get(constant.COOKIE_TOKEN);

      if (modalMode === "edit" && editingCategory?.id) {
        await axios.put(`${constant.DOMAIN_API}/category/${editingCategory.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await axios.post(`${constant.DOMAIN_API}/category/add`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm danh mục thành công!");
      }

      fetchCategories();
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu danh mục");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
    if (!confirmDelete) return;

    try {
      const token = Cookies.get(constant.COOKIE_TOKEN);
      await axios.delete(`${constant.DOMAIN_API}/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Xóa danh mục thất bại");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Catalog</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Loại sản phẩm</h1>
            <p className="mt-2 text-sm text-neutral-500">Quản lý danh mục đang hiển thị trong cửa hàng.</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-neutral-900/20 transition hover:bg-amber-600"
          >
            <Plus size={18} />
            Thêm loại
          </button>
        </div>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Tên loại</th>
                  <th className="px-6 py-4 font-bold">Trạng thái</th>
                  <th className="px-6 py-4 text-right font-bold">Hoạt động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-semibold text-neutral-500">#{category.id}</td>
                      <td className="px-6 py-4 font-bold text-neutral-950">{category.name}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            category.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {category.status === "active" ? "Đang kinh doanh" : "Ngừng kinh doanh"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(category)}
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                          >
                            <Pencil size={14} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 size={14} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-neutral-500">
                      Không có danh mục nào
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
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Catalog</p>
                <h2 className="mt-2 text-2xl font-bold text-neutral-950">
                  {modalMode === "edit" ? "Sửa loại sản phẩm" : "Thêm loại sản phẩm"}
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

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className={labelClass} htmlFor="category-name">
                  Tên loại
                </label>
                <input
                  id="category-name"
                  type="text"
                  className={inputClass}
                  placeholder="Ví dụ: Áo khoác, Giày sneaker..."
                  {...register("name", { required: "Tên loại là bắt buộc" })}
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              <div className="mt-5">
                <label className={labelClass} htmlFor="category-status">
                  Trạng thái
                </label>
                <select
                  id="category-status"
                  className={inputClass}
                  {...register("status", { required: "Vui lòng chọn trạng thái" })}
                >
                  <option value="active">Đang kinh doanh</option>
                  <option value="inactive">Ngừng kinh doanh</option>
                </select>
                {errors.status && <p className={errorClass}>{errors.status.message}</p>}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Đang lưu..." : modalMode === "edit" ? "Lưu thay đổi" : "Lưu danh mục"}
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

export default Category;
