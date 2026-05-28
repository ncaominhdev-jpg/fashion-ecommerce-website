import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Constants from '../../../Constants';
import './OrderDetails.css';

const OrderDetailUser = () => {
    const { id } = useParams();
    const [cookies] = useCookies(['token']);
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const res = await axios.get(`${Constants.DOMAIN_API}/order/${id}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });
            setOrder(res.data.data);
        } catch (err) {
            console.error('Lỗi lấy chi tiết đơn hàng:', err);
        }
    };

    if (!order) return <p>Loading...</p>;

    return (
        <main className="order-detail-container">
            <h2>Chi Tiết Đơn Hàng #{order.id}</h2>

            <div className="order-info">
                <p><strong>Ngày đặt:</strong> {new Date(order.order_date).toLocaleString()}</p>
                <p><strong>Trạng thái:</strong> {order.status}</p>
                <p><strong>Người đặt:</strong> {order.user?.name} ({order.user?.email})</p>
                <p><strong>Sđt:</strong> {order.user?.phone}</p>
                <p><strong>Ghi chú:</strong> {order.note || '-'}</p>
                <p><strong>Địa chỉ:</strong> {order.address?.address}</p>
            </div>

            <h3>Danh sách sản phẩm</h3>
            <div className="order-products">
                {(order.details?.length > 0) ? order.details.map((item, idx) => (
                    <div key={idx} className="order-product-item">
                        <img src={item.variant?.product?.image} alt={item.variant?.product?.name} />
                        <div>
                            <p className="product-name">{item.variant?.product?.name}</p>
                            <p>Kích thước: {item.variant?.size?.size_label}</p>
                            <p>Màu sắc: {item.variant?.color?.color_name}</p>
                            <p>Số lượng: {item.quantity}</p>
                            <p>Giá: {Number(item.price).toLocaleString('vi-VN')} đ</p>
                        </div>
                    </div>
                )) : (
                    <p className="text-muted">Không có sản phẩm nào trong đơn hàng.</p>
                )}
            </div>

        </main>
    );
};

export default OrderDetailUser;
