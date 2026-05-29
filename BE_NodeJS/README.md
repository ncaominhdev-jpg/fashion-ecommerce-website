# Poly Fashion API

Backend REST API cho website bán quần áo Poly Fashion.

## Công nghệ

- Node.js, Express
- MySQL, Sequelize
- JWT authentication
- Multer upload ảnh sản phẩm
- Modules: user, product, category, cart, order, payment, review, contact

## Cài đặt

```bash
npm install
cp .env.example .env
npm run dev
```

API chạy mặc định tại:

```text
http://localhost:3001
```

## Biến môi trường

Xem file `.env.example` và cập nhật thông tin MySQL theo máy của bạn.

## Scripts

```bash
npm run dev      # chạy bằng nodemon
npm start        # chạy production local
```
