import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Constants from '../../../Constants';

const OrderDetailUser = () => {
  const { id } = useParams();
  const [cookies] = useCookies(['token']);
  const [order, setOrder] = useState(null);

  const fetchOrderDetail = useCallback(async () => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/order/${id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });
      setOrder(res.data.data);
    } catch (err) {
      console.error('Lỗi lấy chi tiết đơn hàng:', err);
    }
  }, [cookies.token, id]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  if (!order) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-soft">Đang tải đơn hàng...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-clay">Order detail</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Chi tiết đơn hàng #{order.id}</h1>
      </div>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="h-fit rounded-[2rem] bg-white p-6 shadow-soft">
          <h2 className="font-display text-2xl font-bold text-ink">Thông tin đơn</h2>
          <div className="mt-5 space-y-3 text-sm text-neutral-600">
            <p><strong>Ngày đặt:</strong> {new Date(order.order_date).toLocaleString()}</p>
            <p><strong>Trạng thái:</strong> {order.status}</p>
            <p><strong>Người đặt:</strong> {order.user?.name} ({order.user?.email})</p>
            <p><strong>SĐT:</strong> {order.user?.phone}</p>
            <p><strong>Ghi chú:</strong> {order.note || '-'}</p>
            <p><strong>Địa chỉ:</strong> {order.address?.address}</p>
          </div>
        </aside>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-soft">
          <div className="border-b border-black/10 px-6 py-4">
            <h2 className="font-display text-2xl font-bold text-ink">Danh sách sản phẩm</h2>
          </div>
          <div className="divide-y divide-black/10">
            {order.details?.length > 0 ? order.details.map((item, idx) => (
              <article key={idx} className="grid gap-4 p-5 sm:grid-cols-[96px_1fr_auto] sm:items-center">
                <img src={item.variant?.product?.image} alt={item.variant?.product?.name} className="h-24 w-24 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-extrabold text-ink">{item.variant?.product?.name}</h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    Kích thước: {item.variant?.size?.size_label} · Màu: {item.variant?.color?.color_name} · SL: {item.quantity}
                  </p>
                </div>
                <p className="font-extrabold text-ink">{Number(item.price).toLocaleString('vi-VN')}đ</p>
              </article>
            )) : (
              <p className="p-10 text-center text-neutral-500">Không có sản phẩm nào trong đơn hàng.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default OrderDetailUser;
