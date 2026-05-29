const express = require("express");
const cors = require("cors");
const path = require("path");

const productsRoutes = require("./routes/product.routes");
const colorRoutes = require("./routes/color.routes");
const sizeRoutes = require("./routes/size.routes");
const categoryRoutes = require("./routes/category.routes");
const brandRoutes = require("./routes/brand.routes");
const addressRoutes = require("./routes/address.routes");
const variantRoutes = require("./routes/productVariants.routes");
const reviewRoutes = require("./routes/review.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const orderDetailRoutes = require("./routes/orderDetail.routes");
const paymentRoutes = require("./routes/payment.routes");
const targetGroupRoutes = require("./routes/targetGroup.routes");
const contactRoute = require("./routes/contact.routes");

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get("/", (req, res) => {
  res.json({
    message: "Poly Fashion API is running",
    version: "1.0.0",
    modules: ["products", "categories", "users", "cart", "orders", "reviews", "payments"],
  });
});

app.use(productsRoutes);
app.use(colorRoutes);
app.use(categoryRoutes);
app.use(brandRoutes);
app.use(addressRoutes);
app.use(sizeRoutes);
app.use(variantRoutes);
app.use(reviewRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(orderDetailRoutes);
app.use(paymentRoutes);
app.use(targetGroupRoutes);
app.use("/contact", contactRoute);

app.listen(port, () => {
  console.log(`Poly Fashion API: http://localhost:${port}`);
});
