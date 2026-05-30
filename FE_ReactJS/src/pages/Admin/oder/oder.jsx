import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Eye, Loader2, RefreshCw, Search, X } from "lucide-react";
import { toast } from "sonner";
import HeaderAdmin from "../layout/header";
import constant from "../../../Constants";

const orderStatuses = [
  { value: "pending", label: "Đang xử lý" },
  { value: "shipped", label: "Đang giao" },
  { value: "delivered", label: "Hoàn thành" },
  { value: "canceled", label: "Đã hủy" },
];

const paymentStatuses = {
  pending: "Chờ thanh toán",
  completed: "Đã thanh toán",
  failed: "Thất bại",
};

const statusClass = {
  pending: "bg-amber-50 text-amber-700",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "bg-emerald-50 text-emerald-700",
  canceled: "bg-rose-50 text-rose-700",
};

const inputClass =
  "rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 outline-none transition focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

const formatDate = (value) => {
  if (!value) return "Không rõ";
  return new Date(value).toLocaleString("vi-VN");
};

const getStatusLabel = (status) => orderStatuses.find((item) => item.value === status)?.label || status;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${Cookies.get(constant.COOKIE_TOKEN) || ""}`,
});

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${constant.DOMAIN_API}/order/list`, {
        headers: getAuthHeaders(),
      });
      setOrders(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const text = [
        order.id,
        order.userOrder?.name,
        order.userOrder?.email,
        order.orderAddress?.recipient_name,
        order.orderAddress?.phone,
        order.orderAddress?.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!keyword || text.includes(keyword));
    });
  }, [orders, searchTerm, statusFilter]);

  const orderSummary = useMemo(
    () =>
      orders.reduce(
        (summary, order) => {
          summary.total += 1;
          summary[order.status] = (summary[order.status] || 0) + 1;
          return summary;
        },
        { total: 0, pending: 0, shipped: 0, delivered: 0, canceled: 0 }
      ),
    [orders]
  );

  const openOrderDetail = async (orderId) => {
    setDetailLoading(true);
    setSelectedOrder(null);

    try {
      const res = await axios.get(`${constant.DOMAIN_API}/order/${orderId}`, {
        headers: getAuthHeaders(),
      });
      setSelectedOrder(res.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Không thể tải chi tiết đơn hàng");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    setUpdatingId(orderId);

    try {
      await axios.put(
        `${constant.DOMAIN_API}/order/${orderId}`,
        { status },
        {
          headers: getAuthHeaders(),
        }
      );

      toast.success("Cập nhật trạng thái đơn hàng thành công");
      await fetchOrders();

      if (selectedOrder?.id === orderId) {
        await openOrderDetail(orderId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "Không thể cập nhật đơn hàng");
    } finally {
      setUpdatingId(null);
    }
  };

  const orderItems = selectedOrder?.details || [];
  const productTotal = orderItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  const paymentAmount = Number(selectedOrder?.payment?.amount || productTotal);
  const shippingFee = Math.max(0, paymentAmount - productTotal);

  return (
    <div className="min-h-screen bg-neutral-100">
      <HeaderAdmin />

      <main className="px-5 py-8 lg:ml-72 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-700">Orders</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-neutral-950">Quản lý đơn hàng</h1>
            <p className="mt-2 text-sm text-neutral-500">
              Theo dõi chi tiết sản phẩm, thanh toán và trạng thái giao hàng.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
          >
            <RefreshCw size={18} />
            Làm mới
          </button>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            ["Tổng đơn", orderSummary.total, "bg-neutral-950 text-white"],
            ["Chờ xử lý", orderSummary.pending, "bg-amber-50 text-amber-800"],
            ["Đang giao", orderSummary.shipped, "bg-blue-50 text-blue-800"],
            ["Hoàn thành", orderSummary.delivered, "bg-emerald-50 text-emerald-800"],
            ["Đã hủy", orderSummary.canceled, "bg-rose-50 text-rose-800"],
          ].map(([label, value, className]) => (
            <div key={label} className={`rounded-2xl px-5 py-4 shadow-sm ${className}`}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-70">{label}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="mb-5 flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm lg:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className={`${inputClass} w-full pl-11`}
              placeholder="Tìm theo mã đơn, khách hàng, email, số điện thoại..."
            />
          </label>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={inputClass}>
            <option value="all">Tất cả trạng thái</option>
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </section>

        <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center gap-3 px-6 py-12 text-neutral-500">
              <Loader2 className="animate-spin" size={20} />
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-[0.16em] text-neutral-500">
                    <th className="px-5 py-4 font-bold">Mã đơn</th>
                    <th className="px-5 py-4 font-bold">Khách hàng</th>
                    <th className="px-5 py-4 font-bold">Liên hệ</th>
                    <th className="px-5 py-4 font-bold">Thanh toán</th>
                    <th className="px-5 py-4 font-bold">Ngày đặt</th>
                    <th className="px-5 py-4 font-bold">Trạng thái</th>
                    <th className="px-5 py-4 font-bold">Cập nhật</th>
                    <th className="px-5 py-4 text-right font-bold">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50">
                        <td className="px-5 py-4 font-black text-neutral-950">#{order.id}</td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-neutral-950">{order.userOrder?.name || "Không rõ"}</p>
                          <p className="mt-1 text-xs text-neutral-500">{order.userOrder?.email || "Chưa có email"}</p>
                        </td>
                        <td className="px-5 py-4 text-neutral-600">
                          <p className="font-semibold text-neutral-800">
                            {order.orderAddress?.recipient_name || order.userOrder?.name || "Không rõ"}
                          </p>
                          <p className="mt-1 text-xs">{order.orderAddress?.phone || "Chưa có số điện thoại"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-neutral-950">{formatCurrency(order.payment?.amount)}</p>
                          <p className="mt-1 text-xs text-neutral-500">
                            {order.payment?.payment_method || "Không rõ"} -{" "}
                            {paymentStatuses[order.payment?.status] || order.payment?.status || "Chưa có"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-neutral-600">{formatDate(order.order_date)}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              statusClass[order.status] || statusClass.pending
                            }`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(event) => handleUpdateStatus(order.id, event.target.value)}
                            className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-800 outline-none focus:border-neutral-950"
                          >
                            {orderStatuses.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => openOrderDetail(order.id)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
                          >
                            <Eye size={16} />
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-neutral-500">
                        Không có đơn hàng phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {(selectedOrder || detailLoading) && (
        <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/35 backdrop-blur-sm">
          <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">Order detail</p>
                <h2 className="mt-1 text-2xl font-black text-neutral-950">
                  {selectedOrder ? `Đơn hàng #${selectedOrder.id}` : "Đang tải..."}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setDetailLoading(false);
                }}
                className="rounded-full border border-neutral-200 p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
              >
                <X size={20} />
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center gap-3 px-6 py-16 text-neutral-500">
                <Loader2 className="animate-spin" size={20} />
                Đang tải chi tiết...
              </div>
            ) : (
              selectedOrder && (
                <div className="space-y-5 px-6 py-6">
                  <div className="rounded-3xl border border-neutral-200 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-neutral-500">Trạng thái đơn hàng</p>
                        <p className="mt-1 text-lg font-black text-neutral-950">{getStatusLabel(selectedOrder.status)}</p>
                      </div>
                      <select
                        value={selectedOrder.status}
                        disabled={updatingId === selectedOrder.id}
                        onChange={(event) => handleUpdateStatus(selectedOrder.id, event.target.value)}
                        className={`${inputClass} w-full sm:w-48`}
                      >
                        {orderStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-neutral-200 p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">Khách hàng</p>
                      <h3 className="mt-3 text-lg font-black text-neutral-950">{selectedOrder.user?.name || "Không rõ"}</h3>
                      <p className="mt-1 text-sm text-neutral-500">{selectedOrder.user?.email || "Chưa có email"}</p>
                      <p className="mt-1 text-sm text-neutral-500">{selectedOrder.user?.phone || "Chưa có số điện thoại"}</p>
                    </div>

                    <div className="rounded-3xl border border-neutral-200 p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">Giao hàng</p>
                      <h3 className="mt-3 text-lg font-black text-neutral-950">
                        {selectedOrder.address?.recipient_name || selectedOrder.user?.name || "Không rõ"}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500">{selectedOrder.address?.phone || "Chưa có số điện thoại"}</p>
                      <p className="mt-1 text-sm text-neutral-500">{selectedOrder.address?.address || "Chưa có địa chỉ"}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-neutral-200 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">Thanh toán</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-bold text-neutral-400">Phương thức</p>
                        <p className="mt-1 font-black text-neutral-950">{selectedOrder.payment?.payment_method || "Không rõ"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-400">Trạng thái</p>
                        <p className="mt-1 font-black text-neutral-950">
                          {paymentStatuses[selectedOrder.payment?.status] || selectedOrder.payment?.status || "Chưa có"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-400">Tổng tiền</p>
                        <p className="mt-1 font-black text-neutral-950">{formatCurrency(paymentAmount)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-neutral-200 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">Sản phẩm</p>
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
                        {orderItems.length} dòng
                      </span>
                    </div>

                    <div className="space-y-3">
                      {orderItems.map((item) => {
                        const product = item.variant?.product;
                        const color = item.variant?.color;
                        const size = item.variant?.size;

                        return (
                          <div key={item.id} className="flex gap-4 rounded-2xl bg-neutral-50 p-3">
                            <img
                              src={product?.image || "/newlogo.png"}
                              alt={product?.name || "Sản phẩm"}
                              className="h-20 w-20 rounded-2xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-black text-neutral-950">{product?.name || "Sản phẩm không rõ"}</p>
                              <p className="mt-1 text-xs font-semibold text-neutral-500">
                                Size: {size?.size_label || "Không rõ"} - Màu: {color?.color_name || "Không rõ"}
                              </p>
                              <p className="mt-2 text-sm text-neutral-600">
                                {formatCurrency(item.price)} x {item.quantity}
                              </p>
                            </div>
                            <div className="text-right font-black text-neutral-950">
                              {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 space-y-2 border-t border-neutral-200 pt-4 text-sm">
                      <div className="flex justify-between text-neutral-600">
                        <span>Tạm tính</span>
                        <span className="font-bold">{formatCurrency(productTotal)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Phí/điều chỉnh</span>
                        <span className="font-bold">{formatCurrency(shippingFee)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-black text-neutral-950">
                        <span>Tổng thanh toán</span>
                        <span>{formatCurrency(paymentAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-neutral-200 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400">Ghi chú</p>
                    <p className="mt-3 text-sm text-neutral-600">{selectedOrder.note || "Không có ghi chú"}</p>
                    <p className="mt-4 text-xs font-semibold text-neutral-400">Ngày đặt: {formatDate(selectedOrder.order_date)}</p>
                  </div>
                </div>
              )
            )}
          </aside>
        </div>
      )}
    </div>
  );
};

export default Order;
