import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Constants from '../../../Constants';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies] = useCookies(['token']);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [onlinePayment, setOnlinePayment] = useState(false);
  const [codPayment, setCodPayment] = useState(false);

  const subTotal = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  const shippingFee = 30000;
  const discount = 0;
  const total = subTotal + shippingFee - discount;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id || !cookies.token) return;

    fetchUserAddresses(user.id, cookies.token);

    if (location.state?.selectedItems) {
      setProducts(location.state.selectedItems);
    }
  }, [cookies.token, location.state]);

  const fetchUserAddresses = async (userId, token) => {
    try {
      const res = await axios.get(`${Constants.DOMAIN_API}/address/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(res.data.data);
    } catch (err) {
      console.error(" Lỗi lấy địa chỉ giao hàng:", err);
    }
  };

  const goToAddressManager = () => {
    navigate('/shipping-address-manager');
  };

  const handleConfirmPayment = async () => {
    if (selectedAddressIndex === null) {
      alert('Vui lòng chọn địa chỉ nhận hàng!');
      return;
    }
    if (!onlinePayment && !codPayment) {
      alert('Vui lòng chọn ít nhất một phương thức thanh toán!');
      return;
    }
    if (onlinePayment && codPayment) {
      alert('Vui lòng chỉ chọn một phương thức thanh toán!');
      return;
    }

    const selectedAddress = addresses[selectedAddressIndex];
    const user = JSON.parse(localStorage.getItem('user'));
    const paymentMethod = onlinePayment ? 'Momo' : 'COD';

    const payload = {
      user_id: user.id,
      address_id: selectedAddress.id,
      note: '',
      amount: total,
      payment_method: paymentMethod,
      products: products.map(p => ({
        variant_id: p.variant_id,
        quantity: p.quantity,
        price: p.price
      }))
    };

    try {
      const res = await axios.post(`${Constants.DOMAIN_API}/order/add`, payload, {
        headers: { Authorization: `Bearer ${cookies.token}` }
      });

      await Promise.all(
        products.map(p =>
          axios.delete(`${Constants.DOMAIN_API}/cart/${p.cart_id}`, {
            headers: { Authorization: `Bearer ${cookies.token}` }
          })
        )
      );
      alert('Đặt hàng thành công!');
      navigate('/orders');
    } catch (err) {
      console.error('Lỗi đặt hàng:', err);
      alert(err.response?.data?.message || 'Đặt hàng thất bại');
    }
  };

  const renderProductRows = () =>
    products.map((product) => (
      <tr key={product.id}>
        <td><img src={product.image} alt={product.name} width="50" height="50" /></td>
        <td>{product.name}</td>
        <td>{product.size}</td>
        <td>{product.color}</td>
        <td>{product.quantity}</td>
        <td>{Number(product.price).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND</td>
      </tr>
    ));

  const renderSummaryRows = () => {
    const summaryItems = [
      ['Tổng tiền sản phẩm:', subTotal],
      ['Phí vận chuyển:', shippingFee],
      ['Giảm giá (Voucher):', discount],
      ['Tổng số tiền:', total],
    ];

    return summaryItems.map(([label, value], i) => (
      <div key={i} className={`payment-summary-item ${label.includes('Tổng số tiền') ? 'total' : ''}`}>
        <span>{label}</span>
        <span>{value.toLocaleString()} VND</span>
      </div>
    ));
  };

  const renderAddressOptions = () =>
    addresses.map((addr, index) => (
      <option key={index} value={index}>
        {addr.recipient_name} - {addr.phone} - {addr.address}
      </option>
    ));

  return (
    <main className='container'>
      <div className="payment-container">
        <div className="payment-column-left">
          <h2 className="payment-title">Chọn Địa Chỉ Nhận Hàng</h2>
          <select
            className="payment-select form-control mb-3"
            value={selectedAddressIndex ?? ''}
            onChange={(e) => setSelectedAddressIndex(Number(e.target.value))}
          >
            <option value="">-- Chọn địa chỉ --</option>
            {renderAddressOptions()}
          </select>
          <button className="payment-btn-edit mb-4" onClick={goToAddressManager}>
            Chỉnh Sửa/Thêm Địa Chỉ
          </button>

          <h2 className="payment-title">Sản Phẩm Cần Thanh Toán</h2>
          <table className="payment-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Size</th>
                <th>Màu</th>
                <th>Số lượng</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {renderProductRows()}
            </tbody>
          </table>
        </div>

        <div className="payment-column-right">
          <h2 className="payment-title">Chi Tiết Thanh Toán</h2>
          <div className="payment-summary">
            {renderSummaryRows()}
          </div>

          <div className="payment-method">
            <h3 className="payment-method-title">Chọn Phương Thức Thanh Toán</h3>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="onlinePayment" checked={onlinePayment} disabled={codPayment} onChange={(e) => setOnlinePayment(e.target.checked)} />
              <label className="form-check-label" htmlFor="onlinePayment">Thanh toán Online</label>
              <small>Chọn thanh toán nhanh qua thẻ tín dụng hoặc ví điện tử.</small>
            </div>
            <div className="form-check mt-2">
              <input className="form-check-input" type="checkbox" id="codPayment" checked={codPayment} disabled={onlinePayment} onChange={(e) => setCodPayment(e.target.checked)} />
              <label className="form-check-label" htmlFor="codPayment">Thanh toán khi nhận hàng (COD)</label>
              <small>Trả tiền mặt khi nhận hàng tại địa chỉ đã chọn.</small>
            </div>
          </div>

          <button className="payment-btn-confirm" onClick={handleConfirmPayment}>Xác Nhận Thanh Toán</button>
        </div>
      </div>
    </main>
  );
};

export default Payment;
