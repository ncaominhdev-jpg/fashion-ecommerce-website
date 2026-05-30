import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import ClientLayout from "./layouts/Client/ClientLayout";
import Home from "./pages/Client/Home/Home";
import Shop from "./pages/Client/Shop/Shop";
import ContactPage from "./pages/Client/Contact/Contact";
import ProfilePage from "./pages/Client/Profile/Profile";
import Login from "./pages/Client/Login/login";
import Register from "./pages/Client/Register/register";
import Cart from "./pages/Client/Cart/cart";
import ProductDetail from "./pages/Client/ProductDetail/ProductDetail";
import Payment from "./pages/Client/Payment/Payment";
import OrderUser from "./pages/Client/Order/Order";
import ShippingAddressManager from "./pages/Client/ShippingAddress.Manager/ShippingAddressManager";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import OrderDetailUser from "./pages/Client/OrderDetails/OrderDetails";
import Dashboard from "./pages/Admin/home/home";
import Product from "./pages/Admin/product/product";
import Category from "./pages/Admin/category/category";
import Order from "./pages/Admin/oder/oder";
import User from "./pages/Admin/user/user";
import Comment from "./pages/Admin/comment/comment";
import Size from "./pages/Admin/size/size";
import Color from "./pages/Admin/color/color";
import Brand from "./pages/Admin/brand/brand";
import TargetGroup from "./pages/Admin/target-group/target-group";
import Variant from "./pages/Admin/variant/variant";
import Inventory from "./pages/Admin/inventory/inventory";

function AdminLayout() {
  return <Outlet />;
}

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-linen px-6 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-clay">404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-ink">Trang không tồn tại</h1>
        <p className="mt-3 text-neutral-600">Đường dẫn bạn nhập không có trong hệ thống Poly Fashion.</p>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        richColors
        closeButton
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "18px",
            fontFamily: '"Be Vietnam Pro", sans-serif',
            fontWeight: 600,
          },
        }}
      />
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="payment" element={<Payment />} />
          <Route path="orders" element={<OrderUser />} />
          <Route path="order-detail/:id" element={<OrderDetailUser />} />
          <Route path="shipping-address-manager" element={<ShippingAddressManager />} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="product" element={<Product />} />
          <Route path="categories" element={<Category />} />
          <Route path="brands" element={<Brand />} />
          <Route path="sizes" element={<Size />} />
          <Route path="colors" element={<Color />} />
          <Route path="target-groups" element={<TargetGroup />} />
          <Route path="variants" element={<Variant />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Order />} />
          <Route path="users" element={<User />} />
          <Route path="comments" element={<Comment />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
