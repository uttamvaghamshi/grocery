import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/admin", adminUserRoutes);
app.use("/products", productRoutes);
app.use('/cart',cartRoutes);
app.use('/order',orderRoutes);
app.use('/address',addressRoutes);
app.use('/wishlist',wishlistRoutes);


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
