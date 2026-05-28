import { useEffect, useState } from "react";
import HeaderAdmin from "../layout/header"; // Giả sử HeaderAdmin là phần header của trang quản trị
import "./order.css"; // Giả sử bạn đã có file CSS này
import constant from "../../../../Constants"; // Đảm bảo rằng `constant` chứa các thông tin như API base URL và cookie token

// Lấy token từ cookie
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

// Convert trạng thái đơn hàng
function convertStatus(status) {
  switch (status) {
    case "pending":
      return "Đang xử lý";
    case "shipped":
      return "Đang giao";
    case "delivered":
      return "Hoàn thành";
    case "canceled":
      return "Đã huỷ";
    default:
      return status;
  }
}

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getCookie(constant.COOKIE_TOKEN); // Lấy token từ cookie
      try {
        const res = await fetch(`${constant.DOMAIN_API}/order/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Không thể lấy danh sách đơn hàng");
        }

        const data = await res.json();
        setOrders(data.data); // Gán dữ liệu đơn hàng vào state
      } catch (err) {
        console.error("Lỗi khi gọi API đơn hàng:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="main-container">
      <HeaderAdmin /> {/* Header của trang quản trị */}
      <div className="order-container">
        <div className="order-box">
          <h2 className="order-title">Danh Sách Đơn Hàng</h2>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            <div className="table-responsive">
              <table className="order-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Địa chỉ</th>
                    <th>Ngày đặt</th>
                    <th>Ghi chú</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Ngày cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.userOrder ? order.userOrder.name : "Không rõ"}</td>
                        <td>{order.orderAddress ? order.orderAddress.address : "Không rõ"}</td>
                        <td>{new Date(order.order_date).toLocaleString()}</td>
                        <td>{order.note || "Không có"}</td>
                        <td>{convertStatus(order.status)}</td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td>{new Date(order.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        Không có đơn hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
