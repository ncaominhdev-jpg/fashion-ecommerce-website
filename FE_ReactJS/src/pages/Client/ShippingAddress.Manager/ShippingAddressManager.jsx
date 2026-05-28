import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Constants from '../../../Constants';
import { useCookies } from 'react-cookie';
import './ShippingAddressManager.css';

const ShippingAddressManager = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const [address, setAddress] = useState({
    recipient_name: '',
    address: '',
    phone: '',
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id || !cookies.token) return;
    fetchUserAddresses(user.id, cookies.token);
  }, [cookies.token]);

  const fetchUserAddresses = async (userId, token) => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/address/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAddresses(res.data.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách địa chỉ:', err);
    }
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!address.recipient_name.trim()) errs.recipient_name = 'Vui lòng nhập tên người nhận';
    if (!address.address.trim()) errs.address = 'Vui lòng nhập địa chỉ';
    if (!address.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(address.phone.trim())) {
      errs.phone = 'Số điện thoại không hợp lệ';
    }
    return errs;
  };

  const handleSave = async () => {
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.id || !cookies.token) {
        alert('Vui lòng đăng nhập để lưu địa chỉ.');
        navigate('/login');
        return;
      }
      const payload = { ...address, user_id: user.id };
      await axios.post(`${Constants.DOMAIN_API}/address/add`, payload, {
        headers: {
          Authorization: `Bearer ${cookies.token}`
        }
      });
      alert('Lưu địa chỉ thành công!');
      navigate(-1);
    } catch (err) {
      console.error('Lỗi lưu địa chỉ:', err);
      alert(err.response?.data?.message || 'Không thể lưu địa chỉ.');
    }
  };

  const renderAddressList = () => {
    if (addresses.length === 0) {
      return <p className="text-muted">Chưa có địa chỉ nào được lưu</p>;
    }

    return (
      <ul className="list-group">
        {addresses.map(renderAddressItem)}
      </ul>
    );
  };

  const renderAddressItem = (addr, idx) => {
    return (
      <li key={idx} className="list-group-item">
        <strong> Người nhận: {addr.recipient_name}</strong><br />
        Địa chỉ: {addr.address}<br />
        Số Điện Thoại: {addr.phone}<br />
        <small>Ghi chú: {addr.note}</small>
      </li>
    );
  };

  return (
    <main className="container shipping-address mt-5 mb-5">
      <div className="card p-4">
        <h2 className="text-center mb-3">Thêm Địa Chỉ Giao Hàng</h2>
        <div className="mb-3">
          <label className="form-label">Tên người nhận</label>
          <input className="form-control" name="recipient_name" value={address.recipient_name} onChange={handleChange} />
          {errors.recipient_name && <div className="text-danger mt-1">{errors.recipient_name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input className="form-control" name="phone" value={address.phone} onChange={handleChange} />
          {errors.phone && <div className="text-danger mt-1">{errors.phone}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input className="form-control" name="address" value={address.address} onChange={handleChange} />
          {errors.address && <div className="text-danger mt-1">{errors.address}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Ghi chú</label>
          <textarea className="form-control" name="note" value={address.note} onChange={handleChange} rows={3} />
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleSave}>Lưu địa chỉ</button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
      </div>

      <div className="card p-4 mt-4">
        <h4 className="mb-3">Danh sách địa chỉ đã lưu</h4>
        {renderAddressList()}
      </div>
    </main>
  );
};

export default ShippingAddressManager;
