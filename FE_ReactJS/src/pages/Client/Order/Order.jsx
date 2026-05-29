import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { toast } from 'sonner';
import Constants from '../../../Constants';

const statuses = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xử lý' },
  { key: 'shipped', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'canceled', label: 'Đã hủy' },
];

const OrderUser = () => {
  const [cookies] = useCookies(['token']);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const fetchOrders = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.id) return;

      const res = await axios.get(`${Constants.DOMAIN_API}/order/user/${user.id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách đơn hàng:', err);
    }
  }, [cookies.token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    try {
      await axios.put(`${Constants.DOMAIN_API}/order/${orderId}`, {
        status: 'canceled',
      }, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      toast.success('Đã hủy đơn hàng');
      fetchOrders();
    } catch (err) {
      console.error('Lỗi hủy đơn hàng:', err);
      toast.error('Hủy đơn hàng thất bại');
    }
  };

  const filteredOrders = orders.filter((order) => statusFilter === 'all' || order.status === statusFilter);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);

  const statusLabel = (status) => statuses.find((item) => item.key === status)?.label || status;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Orders</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Đơn hàng của tôi</h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.key}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${statusFilter === status.key ? 'bg-ink text-white' : 'bg-white text-neutral-600 hover:text-ink'}`}
            onClick={() => {
              setStatusFilter(status.key);
              setCurrentPage(1);
            }}
          >
            {status.label}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
        <div className="hidden grid-cols-[90px_1fr_180px_200px] border-b border-black/10 bg-linen px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-neutral-500 md:grid">
          <span>ID</span>
          <span>Ngày đặt</span>
          <span>Trạng thái</span>
          <span>Thao tác</span>
        </div>
        <div className="divide-y divide-black/10">
          {currentOrders.length > 0 ? currentOrders.map((order) => (
            <article key={order.id} className="grid gap-3 px-6 py-5 md:grid-cols-[90px_1fr_180px_200px] md:items-center">
              <p className="font-extrabold text-ink">#{order.id}</p>
              <p className="text-neutral-600">{new Date(order.order_date).toLocaleString()}</p>
              <span className="w-fit rounded-full bg-linen px-3 py-1 text-sm font-bold text-clay">{statusLabel(order.status)}</span>
              <div className="flex gap-2">
                <button onClick={() => { window.location.href = `/order-detail/${order.id}`; }} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
                  Chi tiết
                </button>
                {order.status === 'pending' && (
                  <button onClick={() => handleCancelOrder(order.id)} className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                    Hủy
                  </button>
                )}
              </div>
            </article>
          )) : (
            <div className="p-10 text-center text-neutral-500">Chưa có đơn hàng nào.</div>
          )}
        </div>
      </section>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`grid h-10 w-10 place-items-center rounded-full font-bold ${currentPage === index + 1 ? 'bg-ink text-white' : 'bg-white text-ink'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </main>
  );
};

export default OrderUser;
