# Poly Fashion Ecommerce Website

Poly Fashion là website bán quần áo thời trang full-stack gồm React frontend và Node.js backend. Dự án được thiết kế để trình bày trong phỏng vấn với đầy đủ luồng mua hàng, quản trị sản phẩm và quản lý đơn hàng.

## Điểm nổi bật

- Giao diện client hiện đại bằng Tailwind CSS, responsive cho desktop/mobile.
- Trang admin riêng với dashboard, quản lý sản phẩm, danh mục, đơn hàng, người dùng và bình luận.
- Backend REST API dùng Express, Sequelize và MySQL.
- Xác thực bằng JWT/cookie, phân quyền admin route ở frontend.
- Upload ảnh sản phẩm bằng Multer.
- Thông báo thao tác bằng Sonner toast.

## Cấu trúc dự án

```text
fashion-ecommerce-website/
├── FE_ReactJS/      # React client + admin UI
└── BE_NodeJS/       # Express API + Sequelize models/routes/controllers
```

## Công nghệ

Frontend:

- React
- React Router
- Tailwind CSS
- Axios
- Sonner
- React Slick
- Lucide React

Backend:

- Node.js
- Express
- Sequelize
- MySQL
- JWT
- Multer

## Chạy dự án

Backend:

```bash
cd BE_NodeJS
npm install
cp .env.example .env
npm run dev
```

Frontend:

```bash
cd FE_ReactJS
npm install
npm start
```

URL mặc định:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001
```

## Database

Tạo database MySQL:

```sql
CREATE DATABASE asm_reactjs_clothing_store;
```

Sau đó import file SQL của dự án nếu có dữ liệu mẫu.

## Luồng trình bày phỏng vấn

1. Giới thiệu kiến trúc FE/BE và database MySQL.
2. Demo client: trang chủ, lọc sản phẩm, chi tiết, giỏ hàng, thanh toán.
3. Demo đăng nhập và phân quyền admin.
4. Demo admin: dashboard, thêm/sửa/xóa sản phẩm, danh mục, xem đơn hàng.
5. Mở code theo cấu trúc `routes -> controllers -> models` ở backend và `pages/components/layouts` ở frontend.
