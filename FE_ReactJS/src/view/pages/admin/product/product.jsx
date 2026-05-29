import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";
import HeaderAdmin from "../layout/header";
import constant from "../../../../Constants";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const productsPerPage = 5;

  const fetchProducts = () => {
    axios
      .get(`${constant.DOMAIN_API}/product/list`)
      .then((res) => {
        const data = res.data.data || [];
        setProducts(data);
        setDisplayedProducts(data.slice(0, productsPerPage));
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
      });
  };

  const handleSearch = () => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      setDisplayedProducts(products.slice(0, productsPerPage));
      setCurrentPage(1);
      return;
    }

    const filteredProducts = products.filter((product) => product.name?.toLowerCase().includes(keyword));
    setDisplayedProducts(filteredProducts.slice(0, productsPerPage));
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > Math.ceil(products.length / productsPerPage)) return;
    setCurrentPage(pageNumber);
    const startIndex = (pageNumber - 1) * productsPerPage;
    const endIndex = pageNumber * productsPerPage;
    setDisplayedProducts(products.slice(startIndex, endIndex));
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
  }, []);

  const totalPages = Math.max(1, Math.ceil(products.length / productsPerPage));

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
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="min-w-0 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-medium outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10 sm:w-72"
            />
            <button
              onClick={handleSearch}
              className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-800 transition hover:border-neutral-950"
            >
              Tìm kiếm
            </button>
            <Link
              to="/admin/AddProduct"
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white no-underline shadow-lg shadow-neutral-900/20 transition hover:bg-amber-600"
            >
              Thêm sản phẩm
            </Link>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-5 py-4 font-bold">ID</th>
                  <th className="px-5 py-4 font-bold">Tên sản phẩm</th>
                  <th className="px-5 py-4 font-bold">Danh mục</th>
                  <th className="px-5 py-4 font-bold">Giá</th>
                  <th className="px-5 py-4 font-bold">Mô tả</th>
                  <th className="px-5 py-4 text-right font-bold">Hoạt động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-4 font-semibold text-neutral-500">#{product.id}</td>
                      <td className="px-5 py-4 font-bold text-neutral-950">{product.name}</td>
                      <td className="px-5 py-4 text-neutral-600">{product.category?.name || "Không có"}</td>
                      <td className="px-5 py-4 font-bold text-neutral-950">
                        {Number(product.price || 0).toLocaleString("vi-VN")}đ
                      </td>
                      <td className="max-w-xs truncate px-5 py-4 text-neutral-600">{product.description}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/admin/EditProduct/${product.id}`}
                            className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700 no-underline transition hover:border-neutral-950 hover:text-neutral-950"
                          >
                            Sửa
                          </Link>
                          <button
                            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                            onClick={() => handleDelete(product.id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-neutral-500">
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
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-bold text-neutral-700 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
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
    </div>
  );
};

export default Product;
