import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import logo from "../../../assets/img/logo.webp";
import axios from "axios";
import Constants from "../../../Constants";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [cookies, , removeCookie] = useCookies(["token", "role"]);
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Hàm kiểm tra đăng nhập và lấy user
  const checkAuthentication = () => {
    const token = cookies.token;
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuth(true);
      } catch (error) {
        console.error("Lỗi parse user:", error);
        setUser(null);
        setIsAuth(false);
      }
    } else {
      setUser(null);
      setIsAuth(false);
    }
  };

  // ✅ Hàm lấy số lượng sản phẩm trong giỏ hàng
  const fetchCartCount = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!cookies.token || !storedUser?.id) return;

      const res = await axios.get(`${Constants.DOMAIN_API}/cart/user/${storedUser.id}`, {
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      });

      if (res.data?.data && Array.isArray(res.data.data)) {
        const totalCount = res.data.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
      }
    } catch (err) {
      console.error("Lỗi lấy số lượng giỏ hàng:", err);
    }
  };

  // ✅ Gọi 2 hàm chính khi location/token thay đổi
  useEffect(() => {
    checkAuthentication();
    fetchCartCount();
  }, [location, cookies.token]);

  // ✅ Đăng xuất
  const handleLogout = () => {
    removeCookie("token");
    removeCookie("role");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container-header">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src={logo} alt="Fashion Shop" />
        </Link>

        {/* Thanh tìm kiếm */}
        <div className="search-bar">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          <button type="submit">
            <FaSearch />
          </button>
        </div>

        {/* Menu điều hướng */}
        <nav className="nav">
          <ul className="nav-links">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/shop">Sản phẩm</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
        </nav>

        {/* Hành động người dùng */}
        <div className="user-actions">
          <Link
            to={isAuth ? "/cart" : "#"}
            className="cart"
            onClick={(e) => {
              if (!isAuth) {
                e.preventDefault();
                navigate("/login", {
                  state: { from: "/cart", message: "Vui lòng đăng nhập để xem giỏ hàng" },
                });
              }
            }}
          >
            <FaShoppingCart />
            <span className="cart-count">{cartCount}</span>
          </Link>

          {isAuth && user ? (
            <div className="user-menu">
              <button className="user-btn">
                <img
                  src={user?.avatar || require("../../../assets/img/user-4.jpg")}
                  alt="avatar"
                  className="user-avatar"
                />
                {user?.name || "Tài khoản"}
              </button>
              <ul className="dropdown-menu">
                <li><Link to="/profile">Thông tin</Link></li>
                <li><Link to="/orders">Đơn hàng</Link></li>
                <li><button onClick={handleLogout}>Đăng xuất</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
