import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";
import HeaderAdmin from "../layout/header";
import constant from "../../../../Constants";

const Category = () => {
  const [categories, setCategories] = useState([]);

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
          <Link
            to="/admin/AddCategory"
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white no-underline shadow-lg shadow-neutral-900/20 transition hover:bg-amber-600"
          >
            Thêm loại
          </Link>
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
                          <Link
                            to={`/admin/EditCategory/${category.id}`}
                            className="rounded-full border border-neutral-200 px-4 py-2 text-xs font-bold text-neutral-700 no-underline transition hover:border-neutral-950 hover:text-neutral-950"
                          >
                            Sửa
                          </Link>
                          <button
                            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                            onClick={() => handleDelete(category.id)}
                          >
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
    </div>
  );
};

export default Category;
