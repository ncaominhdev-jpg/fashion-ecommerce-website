import { useEffect, useState } from "react";
import HeaderAdmin from "../layout/header";
import constant from "../../../../Constants";

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function convertStatus(status) {
  switch (status) {
    case "pending":
      return "Đang xử lý";
    case "shipped":
      return "Đang giao";
    case "delivered":
      return "Hoàn thành";
    case "canceled":
      return "Đã hủy";
    default:
      return status;
  }
}

function statusClass(status) {
  switch (status) {
    case "delivered":
      return "bg-emerald-50 text-emerald-700";
    case "shipped":
      return "bg-blue-50 text-blue-700";
    case "canceled":
      return "bg-rose-50 text-rose-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getCookie(constant.COOKIE_TOKEN);
      try {
        const res = await fetch(`${constant.DOMAIN_API}/order/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Không thể lấy danh sách đơn hàng");

        const data = await res.json();
        setOrders(data.data || []);
      } catch (err) {
        console.error("Lỗi khi gọi API đơn hàng:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />
      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Orders</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Danh sách đơn hàng</h1>
          <p className="mt-2 text-sm text-neutral-500">Theo dõi trạng thái giao hàng và thông tin đặt hàng.</p>
        </div>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          {loading ? (
            <div className="px-6 py-12 text-center text-neutral-500">Đang tải dữ liệu...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                    <th className="px-5 py-4 font-bold">ID</th>
                    <th className="px-5 py-4 font-bold">Khách hàng</th>
                    <th className="px-5 py-4 font-bold">Địa chỉ</th>
                    <th className="px-5 py-4 font-bold">Ngày đặt</th>
                    <th className="px-5 py-4 font-bold">Ghi chú</th>
                    <th className="px-5 py-4 font-bold">Trạng thái</th>
                    <th className="px-5 py-4 font-bold">Ngày tạo</th>
                    <th className="px-5 py-4 font-bold">Cập nhật</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50">
                        <td className="px-5 py-4 font-semibold text-neutral-500">#{order.id}</td>
                        <td className="px-5 py-4 font-bold text-neutral-950">{order.userOrder?.name || "Không rõ"}</td>
                        <td className="px-5 py-4 text-neutral-600">{order.orderAddress?.address || "Không rõ"}</td>
                        <td className="px-5 py-4 text-neutral-600">{new Date(order.order_date).toLocaleString("vi-VN")}</td>
                        <td className="px-5 py-4 text-neutral-600">{order.note || "Không có"}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(order.status)}`}>
                            {convertStatus(order.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-neutral-600">{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                        <td className="px-5 py-4 text-neutral-600">{new Date(order.updatedAt).toLocaleString("vi-VN")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-neutral-500">
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Order;
