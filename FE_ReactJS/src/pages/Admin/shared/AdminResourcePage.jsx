import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import HeaderAdmin from "../layout/header";
import constant from "../../../Constants";

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";
const labelClass = "text-sm font-bold text-neutral-800";
const defaultGetListFromResponse = (data) => data?.data || [];

const AdminResourcePage = ({
  title,
  subtitle,
  eyebrow = "Catalog",
  listEndpoint,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  idField = "id",
  fields,
  columns,
  getEmptyForm,
  mapItemToForm,
  normalizePayload,
  getListFromResponse = defaultGetListFromResponse,
}) => {
  const [items, setItems] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = Boolean(modalMode);

  const fetchItems = useCallback(() => {
    axios
      .get(`${constant.DOMAIN_API}${listEndpoint}`)
      .then((res) => setItems(getListFromResponse(res.data)))
      .catch((err) => {
        console.error(`Lỗi khi tải ${title}:`, err);
        toast.error(`Không thể tải ${title.toLowerCase()}`);
      });
  }, [getListFromResponse, listEndpoint, title]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(getEmptyForm());
    setModalMode("add");
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData(mapItemToForm ? mapItemToForm(item) : item);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingItem(null);
    setFormData(getEmptyForm());
  };

  const handleInputChange = (event) => {
    const { name, value, files, type } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "file" ? files?.[0] || null : value,
    }));
  };

  const buildPayload = () => {
    const payload = normalizePayload ? normalizePayload(formData, modalMode, editingItem) : formData;
    const hasFile = Object.values(payload).some((value) => value instanceof File);

    if (!hasFile) return payload;

    const body = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") body.append(key, value);
    });
    return body;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const token = Cookies.get(constant.COOKIE_TOKEN);
      const payload = buildPayload();
      const headers = { Authorization: `Bearer ${token}` };

      if (modalMode === "edit" && editingItem?.[idField]) {
        await axios.put(`${constant.DOMAIN_API}${updateEndpoint(editingItem[idField])}`, payload, { headers });
        toast.success(`Cập nhật ${title.toLowerCase()} thành công`);
      } else {
        await axios.post(`${constant.DOMAIN_API}${createEndpoint}`, payload, { headers });
        toast.success(`Thêm ${title.toLowerCase()} thành công`);
      }

      fetchItems();
      closeModal();
    } catch (error) {
      console.error(`Lỗi khi lưu ${title}:`, error.response?.data || error);
      toast.error(error.response?.data?.message || error.response?.data?.error || `Không thể lưu ${title.toLowerCase()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${title.toLowerCase()} này?`)) return;

    try {
      const token = Cookies.get(constant.COOKIE_TOKEN);
      await axios.delete(`${constant.DOMAIN_API}${deleteEndpoint(item[idField])}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Xóa ${title.toLowerCase()} thành công`);
      fetchItems();
    } catch (error) {
      console.error(`Lỗi khi xóa ${title}:`, error);
      toast.error(`Xóa ${title.toLowerCase()} thất bại`);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">{title}</h1>
            <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-neutral-900/20 transition hover:bg-amber-600"
          >
            <Plus size={18} />
            Thêm mới
          </button>
        </div>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  {columns.map((column) => (
                    <th key={column.key} className={`px-6 py-4 font-bold ${column.align === "right" ? "text-right" : ""}`}>
                      {column.label}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-right font-bold">Hoạt động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item[idField]} className="hover:bg-neutral-50">
                      {columns.map((column) => (
                        <td key={column.key} className={`px-6 py-4 ${column.className || "text-neutral-700"}`}>
                          {column.render ? column.render(item) : item[column.key]}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                          >
                            <Pencil size={14} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
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
                    <td colSpan={columns.length + 1} className="px-6 py-10 text-center text-neutral-500">
                      Chưa có dữ liệu.
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
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">{eyebrow}</p>
                <h2 className="mt-2 text-2xl font-bold text-neutral-950">
                  {modalMode === "edit" ? `Sửa ${title.toLowerCase()}` : `Thêm ${title.toLowerCase()}`}
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
              {fields.map((field) => (
                <div key={field.name}>
                  <label className={labelClass} htmlFor={field.name}>
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      className={inputClass}
                      value={formData[field.name] || ""}
                      onChange={handleInputChange}
                      required={field.required}
                    >
                      <option value="">-- Chọn --</option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      name={field.name}
                      type={field.type || "text"}
                      className={inputClass}
                      placeholder={field.placeholder}
                      value={field.type === "file" ? undefined : formData[field.name] || ""}
                      onChange={handleInputChange}
                      required={field.required}
                      accept={field.accept}
                    />
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
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

export default AdminResourcePage;
