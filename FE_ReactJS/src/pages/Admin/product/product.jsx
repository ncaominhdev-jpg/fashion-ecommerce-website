import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import HeaderAdmin from "../layout/header";
import constant from "../../../Constants";

const inputClass =
  "mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";
const labelClass = "text-sm font-bold text-neutral-800";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  sale_price: "",
  stock: "",
  category_id: "",
  brand_id: "1",
  target_group_id: "1",
};

const uploadImageToCloudinary = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", constant.UPLOAD_PRESET);

  const res = await axios.post(`https://api.cloudinary.com/v1_1/${constant.CLOUD_NAME}/image/upload`, formData);
  return res.data.secure_url;
};

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [targetGroups, setTargetGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMode, setModalMode] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const productsPerPage = 5;

  const isModalOpen = Boolean(modalMode);
  const brandById = useMemo(() => new Map(brands.map((item) => [Number(item.id), item])), [brands]);
  const targetGroupById = useMemo(() => new Map(targetGroups.map((item) => [Number(item.id), item])), [targetGroups]);

  const fetchProducts = () => {
    axios
      .get(`${constant.DOMAIN_API}/product/list`)
      .then((res) => {
        setProducts(res.data.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
      });
  };

  const fetchCategories = () => {
    axios
      .get(`${constant.DOMAIN_API}/category/list`)
      .then((res) => {
        setCategories((res.data.data || []).filter((category) => category.status === "active"));
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh mục:", err);
      });
  };

  const fetchBrands = () => {
    axios
      .get(`${constant.DOMAIN_API}/brand/list`)
      .then((res) => setBrands((res.data.data || []).filter((brand) => brand.status !== "inactive")))
      .catch((err) => {
        console.error("Lỗi khi lấy thương hiệu:", err);
      });
  };

  const fetchTargetGroups = () => {
    axios
      .get(`${constant.DOMAIN_API}/target-group/list`)
      .then((res) => setTargetGroups(res.data.data || []))
      .catch((err) => {
        console.error("Lỗi khi lấy nhóm khách:", err);
      });
  };

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return products;
    return products.filter((product) => product.name?.toLowerCase().includes(keyword));
  }, [products, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const displayedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageFile(null);
    setModalMode("add");
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      sale_price: product.sale_price || "",
      stock: product.stock || "",
      category_id: product.category_id || "",
      brand_id: product.brand_id || "1",
      target_group_id: product.target_group_id || "1",
    });
    setImageFile(null);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageFile(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.warning("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!formData.price) {
      toast.warning("Vui lòng nhập giá sản phẩm");
      return;
    }
    if (!formData.category_id) {
      toast.warning("Vui lòng chọn danh mục");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = Cookies.get(constant.COOKIE_TOKEN);
      const imageUrl = imageFile ? await uploadImageToCloudinary(imageFile) : "";
      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        sale_price: formData.sale_price || 0,
        stock: formData.stock || 0,
        category_id: formData.category_id,
        brand_id: formData.brand_id || 1,
        target_group_id: formData.target_group_id || 1,
        ...(imageUrl ? { image: imageUrl } : {}),
      };

      if (modalMode === "edit" && editingProduct?.id) {
        await axios.put(`${constant.DOMAIN_API}/product/${editingProduct.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        await axios.post(`${constant.DOMAIN_API}/product/add`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm sản phẩm thành công!");
      }

      fetchProducts();
      closeModal();
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error.response?.data || error);
      toast.error(error.response?.data?.message || error.response?.data?.error || "Có lỗi xảy ra khi lưu sản phẩm");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (!confirmDelete) return;

    try {
      const token = Cookies.get(constant.COOKIE_TOKEN);
      await axios.delete(`${constant.DOMAIN_API}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Xóa sản phẩm thành công");
      fetchProducts();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      toast.error("Xóa sản phẩm thất bại");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
    fetchTargetGroups();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Inventory</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Danh sách sản phẩm</h1>
            <p className="mt-2 text-sm text-neutral-500">Quản lý sản phẩm, giá bán, danh mục và mô tả hiển thị.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="min-w-0 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10 sm:w-72"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-800 transition hover:border-neutral-950"
            >
              <Search size={17} />
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-neutral-900/20 transition hover:bg-amber-600"
            >
              <Plus size={18} />
              Thêm sản phẩm
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-5 py-4 font-bold">ID</th>
                  <th className="px-5 py-4 font-bold">Tên sản phẩm</th>
                  <th className="px-5 py-4 font-bold">Danh mục</th>
                  <th className="px-5 py-4 font-bold">Thương hiệu</th>
                  <th className="px-5 py-4 font-bold">Nhóm khách</th>
                  <th className="px-5 py-4 font-bold">Giá</th>
                  <th className="px-5 py-4 font-bold">Mô tả</th>
                  <th className="px-5 py-4 text-right font-bold">Hoạt động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => {
                    const brand = brandById.get(Number(product.brand_id));
                    const targetGroup = targetGroupById.get(Number(product.target_group_id));

                    return (
                    <tr key={product.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-4 font-semibold text-neutral-500">#{product.id}</td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-neutral-950">{product.name}</p>
                        <div className="mt-2 flex max-w-sm flex-wrap gap-2">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                            {product.category?.name || "Chưa có loại"}
                          </span>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            {brand?.name || "Chưa có thương hiệu"}
                          </span>
                          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-700">
                            {targetGroup?.label || "Chưa có nhóm khách"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-neutral-600">{product.category?.name || "Không có"}</td>
                      <td className="px-5 py-4 text-neutral-600">{brand?.name || "Chưa có"}</td>
                      <td className="px-5 py-4 text-neutral-600">{targetGroup?.label || "Chưa có"}</td>
                      <td className="px-5 py-4 font-bold text-neutral-950">
                        {Number(product.price || 0).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="max-w-xs truncate px-5 py-4 text-neutral-600">{product.description}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                          >
                            <Pencil size={14} />
                            Sửa
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                            onClick={() => handleDelete(product.id)}
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
                    <td colSpan="8" className="px-6 py-10 text-center text-neutral-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 px-6 py-5 sm:flex-row">
            <p className="text-sm font-semibold text-neutral-500">
              Trang {currentPage} / {totalPages}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  type="button"
                  onClick={() => paginate(index + 1)}
                  className={`h-10 w-10 rounded-full text-sm font-bold transition ${
                    currentPage === index + 1
                      ? "bg-neutral-950 text-white"
                      : "border border-neutral-200 text-neutral-700 hover:border-neutral-950"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/30 px-4 py-4" onMouseDown={closeModal}>
          <aside
            className="ml-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">Inventory</p>
                <h2 className="mt-2 text-2xl font-bold text-neutral-950">
                  {modalMode === "edit" ? "Sửa sản phẩm" : "Thêm sản phẩm"}
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

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="product-name">
                    Tên sản phẩm
                  </label>
                  <input
                    id="product-name"
                    name="name"
                    type="text"
                    className={inputClass}
                    placeholder="Ví dụ: Áo blazer linen"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="product-price">
                    Giá
                  </label>
                  <input
                    id="product-price"
                    name="price"
                    type="number"
                    step="0.01"
                    className={inputClass}
                    placeholder="1200000"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="product-sale-price">
                    Giá khuyến mãi
                  </label>
                  <input
                    id="product-sale-price"
                    name="sale_price"
                    type="number"
                    step="0.01"
                    className={inputClass}
                    placeholder="0"
                    value={formData.sale_price}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="product-stock">
                    Tồn kho
                  </label>
                  <input
                    id="product-stock"
                    name="stock"
                    type="number"
                    className={inputClass}
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="product-category">
                    Danh mục
                  </label>
                  <select
                    id="product-category"
                    name="category_id"
                    className={inputClass}
                    value={formData.category_id}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="product-brand">
                    Thương hiệu
                  </label>
                  <select
                    id="product-brand"
                    name="brand_id"
                    className={inputClass}
                    value={formData.brand_id}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn thương hiệu --</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="product-target-group">
                    Nhóm khách
                  </label>
                  <select
                    id="product-target-group"
                    name="target_group_id"
                    className={inputClass}
                    value={formData.target_group_id}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn nhóm khách --</option>
                    {targetGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="product-image">
                    Hình ảnh
                  </label>
                  <input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    className={inputClass}
                    onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  />
                  <p className="mt-2 text-xs font-semibold text-neutral-500">
                    {imageFile
                      ? "Ảnh mới sẽ được upload lên Cloudinary."
                      : modalMode === "edit"
                        ? "Không chọn ảnh mới thì giữ ảnh hiện tại."
                        : "Có thể bổ sung ảnh trước khi lưu."}
                  </p>
                </div>
              </div>

              {modalMode === "edit" && editingProduct?.image && (
                <div className="mt-5">
                  <label className={labelClass}>Ảnh hiện tại</label>
                  <img src={editingProduct.image} alt={editingProduct.name} className="mt-2 h-28 w-28 rounded-2xl object-cover" />
                </div>
              )}

              <div className="mt-5">
                <label className={labelClass} htmlFor="product-description">
                  Mô tả
                </label>
                <textarea
                  id="product-description"
                  name="description"
                  rows={5}
                  className={inputClass}
                  placeholder="Mô tả chất liệu, kiểu dáng và điểm nổi bật..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Đang lưu..." : modalMode === "edit" ? "Lưu thay đổi" : "Thêm sản phẩm"}
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

export default Product;
