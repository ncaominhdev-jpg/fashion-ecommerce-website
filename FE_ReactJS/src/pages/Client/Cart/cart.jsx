import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Constants from "../../../Constants";
import "./cart.css";

function Cart() {
    const [cookies] = useCookies(["token"]);
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.id) return;

            const res = await axios.get(`${Constants.DOMAIN_API}/cart/user/${user.id}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });

            const items = res.data.data.map(item => {
                const finalPrice = item.sale_price > 0 ? item.sale_price : item.price;
                return {
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    price: finalPrice,
                    original_price: item.price,
                    sale_price: item.sale_price,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    variant_id: item.variant_id,
                };
            });

            setCartItems(items);
        } catch (err) {
            console.error("Lỗi lấy giỏ hàng:", err);
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        try {
            await axios.put(`${Constants.DOMAIN_API}/cart/${itemId}`, {
                quantity: newQuantity
            }, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });

            setCartItems(cartItems.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ));
        } catch (err) {
            console.error("Cập nhật số lượng thất bại:", err);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await axios.delete(`${Constants.DOMAIN_API}/cart/${itemId}`, {
                headers: { Authorization: `Bearer ${cookies.token}` }
            });

            setCartItems(cartItems.filter(item => item.id !== itemId));
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } catch (err) {
            console.error("Xoá sản phẩm thất bại:", err);
        }
    };

    const handleSelectItem = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter(id => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.id));
        }
    };

    const calculateTotal = () => {
        return cartItems
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const renderCartRows = () => {
        return cartItems.map(item => (
            <tr key={item.id}>
                <td>
                    <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                    />
                </td>
                <td>
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                </td>
                <td>{item.name}</td>
                <td>
                    {item.sale_price > 0 ? (
                        <span className="text-danger fw-bold">
                            {Number(item.sale_price).toLocaleString("vi-VN")} đ
                        </span>
                    ) : (
                        <span className="fw-bold">
                            {Number(item.original_price).toLocaleString("vi-VN")} đ
                        </span>
                    )}
                </td>
                <td>{item.color || "N/A"}</td>
                <td>{item.size || "N/A"}</td>
                <td>
                    <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                            const quantity = Math.max(1, parseInt(e.target.value));
                            updateQuantity(item.id, quantity);
                        }}
                        className="cart-item-quantity-input"
                    />
                </td>
                <td>
                    <button onClick={() => removeItem(item.id)} className="cart-item-remove-button">
                        Xoá
                    </button>
                </td>
            </tr>
        ));
    };

    const renderCartSummary = () => (
        <>
            <h2>Tóm tắt đơn hàng</h2>
            <p>
                Tổng ({selectedItems.length} sản phẩm):{" "}
                {calculateTotal().toLocaleString("vi-VN")} đ
            </p>
            <div className="discount-section">
                <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    className="discount-input"
                />
                <button className="apply-discount-button">Áp dụng</button>
            </div>
            <button className="cart-checkout-button" disabled={!selectedItems.length}>
                <Link
                    to="/payment"
                    state={{
                        selectedItems: cartItems.filter(item =>
                            selectedItems.includes(item.id)
                        ).map(item => ({
                            ...item,
                            cart_id: item.id
                        })),
                        total: calculateTotal()
                    }}
                    className="text-white text-decoration-none"
                >
                    Thanh toán
                </Link>
            </button>
        </>
    );

    return (
        <main className="container">
            <div className="cart-container">
                <div className="cart-main">
                    <h2 className="cart-title">Giỏ hàng của bạn</h2>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === cartItems.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Màu</th>
                                <th>Size</th>
                                <th>Số lượng</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderCartRows()}
                        </tbody>
                    </table>
                </div>
                <div className="cart-sidebar">
                    {renderCartSummary()}
                </div>
            </div>
        </main>
    );
}

export default Cart;
