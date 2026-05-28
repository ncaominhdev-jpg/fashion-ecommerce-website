import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Constants from '../../../Constants';
import './Order.css';

const OrderUser = () => {
    const [cookies] = useCookies(['token']);
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.id) {
                console.warn('user không tồn tại trong localStorage');
                return;
            }

            const res = await axios.get(`${Constants.DOMAIN_API}/order/user/${user.id}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });

            setOrders(res.data.data);
        } catch (err) {
            console.error('Lỗi lấy danh sách đơn hàng:', err);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc muốn huỷ đơn hàng này?')) return;

        try {
            await axios.put(`${Constants.DOMAIN_API}/order/${orderId}`, {
                status: 'canceled'
            }, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });

            // Reload lại đơn hàng sau khi huỷ
            fetchOrders();
        } catch (err) {
            console.error('Lỗi huỷ đơn hàng:', err);
            alert('Huỷ đơn hàng thất bại');
        }
    };

    const handleViewDetail = (orderId) => {
        window.location.href = `/order-detail/${orderId}`;
    };



    const filteredOrders = orders.filter(order => {
        if (statusFilter === 'all') return true;
        return order.status === statusFilter;
    });

    const indexOfLast = currentPage * ordersPerPage;
    const indexOfFirst = indexOfLast - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'shipped': return 'Đang giao';
            case 'delivered': return 'Đã giao';
            case 'canceled': return 'Đã huỷ';
            default: return status;
        }
    };

    const renderOrders = () => (
        <table className="order-user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Ngày đặt</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                </tr>
            </thead>
            <tbody>
                {currentOrders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{new Date(order.order_date).toLocaleString()}</td>
                        <td className={`order-user-status-${order.status}`}>
                            {getStatusLabel(order.status)}
                        </td>
                        <td>
                            <div className="order-user-action-group">
                                <button onClick={() => handleViewDetail(order.id)} className="btn btn-sm btn-info">Chi tiết</button>
                                {order.status === 'pending' && (
                                    <button onClick={() => handleCancelOrder(order.id)} className="btn btn-sm btn-danger">
                                        Huỷ
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const renderPagination = () => (
        <div className="order-user-pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
            </button>
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? 'active' : ''}
                >
                    {i + 1}
                </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                &gt;
            </button>
        </div>
    );

    return (
        <main className="container mt-5">
            <h2>Đơn hàng của tôi</h2>
            <div className="order-user-tabs">
                {['all', 'pending', 'shipped', 'delivered', 'canceled'].map(status => (
                    <button
                        key={status}
                        className={statusFilter === status ? 'active' : ''}
                        onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                    >
                        {status === 'all' ? 'Tất cả' :
                            status === 'pending' ? 'Chờ xử lý' :
                                status === 'shipped' ? 'Đang giao' :
                                    status === 'delivered' ? 'Đã giao' : 'Đã huỷ'}
                    </button>
                ))}
            </div>

            {renderOrders()}
            {renderPagination()}
        </main>
    );
};

export default OrderUser;
