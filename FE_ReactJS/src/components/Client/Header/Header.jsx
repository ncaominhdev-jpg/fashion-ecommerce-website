import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingBag } from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import logo from "../../../assets/img/logo.webp";
import userFallback from "../../../assets/img/user-4.jpg";
import axios from "axios";
import Constants from "../../../Constants";

const navItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Sản phẩm", to: "/shop" },
  { label: "Liên hệ", to: "/contact" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cookies, , removeCookie] = useCookies(["token", "role"]);
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkAuthentication = useCallback(() => {
    const token = cookies.token;
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuth(true);
      } catch (error) {
        console.error("Lỗi đọc thông tin người dùng:", error);
        setUser(null);
        setIsAuth(false);
      }
      return;
    }

    setUser(null);
    setIsAuth(false);
  }, [cookies.token]);

  const fetchCartCount = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!cookies.token || !storedUser?.id) {
        setCartCount(0);
        return;
      }

      const res = await axios.get(`${Constants.DOMAIN_API}/cart/user/${storedUser.id}`, {
        headers: { Authorization: `Bearer ${cookies.token}` },
      });

      if (Array.isArray(res.data?.data)) {
        setCartCount(res.data.data.reduce((sum, item) => sum + item.quantity, 0));
      }
    } catch (err) {
      console.error("Lỗi lấy số lượng giỏ hàng:", err);
    }
  }, [cookies.token]);

  useEffect(() => {
    checkAuthentication();
    fetchCartCount();
    setIsMenuOpen(false);
  }, [location, checkAuthentication, fetchCartCount]);

  const handleLogout = () => {
    removeCookie("token");
    removeCookie("role");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuth(false);
    navigate("/login");
  };

  const handleCartClick = (event) => {
    if (!isAuth) {
      event.preventDefault();
      navigate("/login", {
        state: { from: "/cart", message: "Vui lòng đăng nhập để xem giỏ hàng" },
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-linen/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src={logo} alt="Poly Fashion" className="h-12 w-12 rounded-full object-cover ring-1 ring-black/10" />
          <div className="hidden leading-tight sm:block">
            <p className="font-display text-xl font-bold text-ink">Poly Fashion</p>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-clay">Modern wear</p>
          </div>
        </Link>

        <div className="hidden min-w-[260px] flex-1 items-center rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm lg:flex">
          <input
            type="text"
            placeholder="Tìm áo khoác, sneaker, váy..."
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-neutral-400"
          />
          <button className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white transition hover:bg-clay" aria-label="Tìm kiếm">
            <FaSearch />
          </button>
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-bold no-underline transition ${
                  active ? "bg-ink text-white" : "text-neutral-700 hover:bg-white hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to={isAuth ? "/cart" : "#"}
            onClick={handleCartClick}
            className="relative grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white text-ink no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
            aria-label="Giỏ hàng"
          >
            <FaShoppingBag />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          </Link>

          {isAuth && user ? (
            <div className="group relative hidden sm:block">
              <button className="flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-2 pr-4 text-sm font-semibold text-ink shadow-sm">
                <img src={user?.avatar || userFallback} alt="Avatar" className="h-8 w-8 rounded-full object-cover" />
                {user?.name || "Tài khoản"}
              </button>
              <div className="invisible absolute right-0 mt-3 w-48 translate-y-2 rounded-2xl border border-black/10 bg-white p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <Link className="block rounded-xl px-3 py-2 text-sm font-semibold no-underline hover:bg-linen" to="/profile">
                  Thông tin
                </Link>
                <Link className="block rounded-xl px-3 py-2 text-sm font-semibold no-underline hover:bg-linen" to="/orders">
                  Đơn hàng
                </Link>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-clay hover:bg-linen" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="rounded-full px-4 py-2 text-sm font-bold text-ink no-underline hover:bg-white">
                Đăng nhập
              </Link>
              <Link to="/register" className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white no-underline shadow-sm hover:bg-clay">
                Đăng ký
              </Link>
            </div>
          )}

          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-white lg:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label="Mở menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-black/10 bg-linen px-4 py-4 lg:hidden">
          <div className="mb-4 flex items-center rounded-full border border-black/10 bg-white px-4 py-2">
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Tìm sản phẩm..." />
            <FaSearch className="text-clay" />
          </div>
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className="rounded-2xl bg-white px-4 py-3 font-semibold no-underline shadow-sm">
                {item.label}
              </Link>
            ))}
            {!isAuth && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/login" className="rounded-full border border-black/10 bg-white px-4 py-3 text-center font-bold no-underline">
                  Đăng nhập
                </Link>
                <Link to="/register" className="rounded-full bg-ink px-4 py-3 text-center font-bold text-white no-underline">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
