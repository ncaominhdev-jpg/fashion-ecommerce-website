const express = require('express');
const cors = require("cors");
const path = require('path');
const app = express();
const port = 3001;

const productsRoutes = require('./routes/product.routes');
const ColorRoutes = require('./routes/color.routes');
const SizeRoutes = require('./routes/size.routes');
const categoryRoutes = require('./routes/category.routes');
const brandRoutes = require('./routes/brand.routes');
const addressRoutes = require('./routes/address.routes');
const variantRoutes = require('./routes/productVariants.routes');
const reviewRoutes = require('./routes/review.routes');
const userRoutes = require('./routes/user.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const orderDetailRoutes = require('./routes/orderDetail.routes');
const PaymentRoutes = require('./routes/payment.routes');
const targetGroupRoutes = require('./routes/targetGroup.routes');
const contactRoute = require('./routes/contact.routes');




app.use(express.json())

app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(productsRoutes);
app.use(ColorRoutes);
app.use(categoryRoutes);
app.use(brandRoutes);
app.use(addressRoutes);
app.use(SizeRoutes);
app.use(variantRoutes);
app.use(reviewRoutes);
app.use(userRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(orderDetailRoutes);
app.use(PaymentRoutes);
app.use(targetGroupRoutes);
app.use("/contact", contactRoute);
app.listen(port, () => {
    console.log('http://localhost:3001');
})