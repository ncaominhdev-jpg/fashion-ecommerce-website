import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Boxes, MessageSquareText, PackageCheck, UsersRound } from "lucide-react";
import HeaderAdmin from "../layout/header";
import constant from "../../../../Constants";

const statsConfig = [
  { label: "Đơn hàng", key: "orders", icon: PackageCheck, tone: "bg-emerald-50 text-emerald-700" },
  { label: "Sản phẩm", key: "products", icon: Boxes, tone: "bg-blue-50 text-blue-700" },
  { label: "Đánh giá", key: "comments", icon: MessageSquareText, tone: "bg-amber-50 text-amber-700" },
  { label: "Người dùng", key: "users", icon: UsersRound, tone: "bg-rose-50 text-rose-700" },
];

const Dashboard = () => {
  const [stats, setStats] = useState({ orders: 0, products: 0, comments: 0, users: 0 });
  const [cookies] = useCookies([constant.COOKIE_TOKEN]);

  useEffect(() => {
    const token = cookies[constant.COOKIE_TOKEN];
    if (!token) {
      console.error("Token không tồn tại trong cookie.");
      return;
    }

    const fetchCount = async (path, key, label) => {
      try {
        const res = await axios.get(`${constant.DOMAIN_API}${path}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats((prev) => ({ ...prev, [key]: res.data.count || 0 }));
      } catch (err) {
        console.error(`Lỗi khi lấy ${label}:`, err);
      }
    };

    fetchCount("/order/count", "orders", "số lượng đơn hàng");
    fetchCount("/product/count", "products", "số lượng sản phẩm");
    fetchCount("/review/count", "comments", "số lượng đánh giá");
    fetchCount("/user/count", "users", "số lượng người dùng");
  }, [cookies]);

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Bảng điều khiển</h1>
            <p className="mt-2 text-sm text-neutral-500">Theo dõi nhanh tình hình bán hàng và vận hành cửa hàng.</p>
          </div>
          <Link
            to="/admin/product"
            className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-bold text-white no-underline shadow-lg shadow-neutral-900/20 transition hover:bg-amber-600"
          >
            Quản lý sản phẩm
          </Link>
        </div>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statsConfig.map(({ label, key, icon: Icon, tone }) => (
            <div key={key} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                <Icon size={24} />
              </div>
              <p className="text-sm font-semibold text-neutral-500">{label}</p>
              <p className="mt-2 text-4xl font-bold tracking-normal text-neutral-950">{stats[key]}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-normal text-neutral-950">Giao dịch gần đây</h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Demo</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                  <th className="px-4 py-4 font-bold">Ngày</th>
                  <th className="px-4 py-4 font-bold">Hóa đơn</th>
                  <th className="px-4 py-4 font-bold">Khách hàng</th>
                  <th className="px-4 py-4 font-bold">Số tiền</th>
                  <th className="px-4 py-4 font-bold">Trạng thái</th>
                  <th className="px-4 py-4 font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="hover:bg-neutral-50">
                    <td className="px-4 py-4 text-neutral-600">01/01/2025</td>
                    <td className="px-4 py-4 font-semibold text-neutral-950">INV-0123</td>
                    <td className="px-4 py-4 text-neutral-600">Nguyễn Văn A</td>
                    <td className="px-4 py-4 font-bold text-neutral-950">1.230.000đ</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                        Đã thanh toán
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link to="/admin/orders" className="font-bold text-amber-700 no-underline hover:text-neutral-950">
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
