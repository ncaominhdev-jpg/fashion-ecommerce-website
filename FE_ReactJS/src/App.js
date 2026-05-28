import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientLayout from "./layouts/Client/ClientLayout";
import Home from "./pages/Client/Home/Home";
import "./assets/styles/global.css"
import Shop from "./pages/Client/Shop/Shop";
import ContactPage from "./pages/Client/Contact/Contact";
import ProfilePage from "./pages/Client/Profile/Profile";
import Login from "./pages/Client/Login/login";
import Register from "./pages/Client/Register/register";
import Cart from "./pages/Client/Cart/cart";
import ProductDetail from "./pages/Client/ProductDetail/ProductDetail";
import { Outlet } from "react-router";
import Payment from "./pages/Client/Payment/Payment"
import OrderUser from "./pages/Client/Order/Order";
import ShippingAddressManager from "./pages/Client/ShippingAddress.Manager/ShippingAddressManager"
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import OrderDetailUser from "./pages/Client/OrderDetails/OrderDetails";

// Import các trang
import Dashboard from "./view/pages/admin/home/home";
import Product from "./view/pages/admin/product/product";
import Category from "./view/pages/admin/category/category";
import Order from "./view/pages/admin/oder/oder";
import User from "./view/pages/admin/user/user";
import Comment from "./view/pages/admin/comment/comment";
import EditCategory from "./view/pages/admin/category/edit-category/edit-category";
import AddCategory from "./view/pages/admin/category/add-category/add-category";
import AddProduct from "./view/pages/admin/product/add-product/add-product";
import EditProduct from "./view/pages/admin/product/edit-product/edit-product";



// Layout chung cho Admin
function AdminLayout() {
  return (
    <div>

      <Outlet /> {/* Quan trọng: Render nội dung các trang con */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
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
        {/* Admin Layout */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Dashboard />} /> {/* Trang mặc định /admin */}
          <Route path="product" element={<Product />} />
          <Route path="AddProduct" element={<AddProduct />} />
          <Route path="EditProduct/:id" element={<EditProduct />} />
          <Route path="categories" element={<Category />} />
          <Route path="EditCategory/:id" element={<EditCategory />} />
          <Route path="AddCategory" element={<AddCategory />} />
          <Route path="orders" element={<Order />} />
          <Route path="users" element={<User />} />
          <Route path="comments" element={<Comment />} />
        </Route>
        {/* Route 404 nếu nhập sai đường dẫn */}
        <Route path="*" element={<h2>Trang không tồn tại</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
