import React, { useEffect, useState } from "react";
import HeaderAdmin from "../layout/header";
import constant from "../../../../Constants";
import Cookies from "js-cookie";
import { toast } from "sonner";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookies.get(constant.COOKIE_TOKEN);
        if (!token) {
          console.log("Token không tồn tại.");
          return;
        }

        const response = await fetch(`${constant.DOMAIN_API}/user/list`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.data || []);
        } else {
          console.error("Failed to fetch users:", response.status);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
    if (!confirmDelete) return;

    const token = Cookies.get(constant.COOKIE_TOKEN);
    if (!token) {
      console.log("Token không tồn tại.");
      return;
    }

    try {
      const response = await fetch(`${constant.DOMAIN_API}/user/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success("Xóa người dùng thành công.");
      } else {
        toast.error("Xóa thất bại. Vui lòng thử lại.");
        console.error("Failed to delete user:", response.status);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Lỗi khi xóa người dùng.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Customers</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Danh sách người dùng</h1>
          <p className="mt-2 text-sm text-neutral-500">Quản lý tài khoản khách hàng trong hệ thống.</p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-6 py-4 font-bold">ID</th>
                  <th className="px-6 py-4 font-bold">Tên</th>
                  <th className="px-6 py-4 font-bold">Số điện thoại</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 text-right font-bold">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-neutral-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 font-semibold text-neutral-500">#{user.id}</td>
                      <td className="px-6 py-4 font-bold text-neutral-950">{user.name}</td>
                      <td className="px-6 py-4 text-neutral-600">{user.phone}</td>
                      <td className="px-6 py-4 text-neutral-600">{user.email}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                          onClick={() => handleDelete(user.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-neutral-500">
                      Không có người dùng nào
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

export default User;
