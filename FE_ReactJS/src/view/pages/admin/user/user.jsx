import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import HeaderAdmin from "../layout/header";
import constant from "../../../../Constants"; 
import Cookies from "js-cookie";
import "./user.css";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch danh sách người dùng
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.data);
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

  // Xử lý xoá người dùng
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá người dùng này?");
    if (!confirmDelete) return;

    const token = Cookies.get(constant.COOKIE_TOKEN);
    if (!token) {
      console.log("Token không tồn tại.");
      return;
    }

    try {
      const response = await fetch(`${constant.DOMAIN_API}/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        alert("Xoá người dùng thành công.");
      } else {
        alert("Xoá thất bại. Vui lòng thử lại.");
        console.error("Failed to delete user:", response.status);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Lỗi khi xoá người dùng.");
    }
  };

  return (
    <div className="d-flex user-page">
      <HeaderAdmin />
      <div className="user-container p-4">
        <h2 className="user-title">Danh Sách Người Dùng</h2>
        <div className="table-responsive">
          <table className="user-table table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Số Điện Thoại</th>
                <th>Email</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Đang tải...</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default User;
