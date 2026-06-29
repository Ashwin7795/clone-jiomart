const express = require("express");

const dotenv = require("dotenv");

const connectDB = require("./config/db");

const cors = require("cors");


const productRoutes = require("./routes/productRoutes");

const authRoutes = require("./routes/authRoutes");

const testRoutes = require("./routes/testRoutes");

const cartRoutes = require("./routes/cartRoutes");

const orderRoutes = require("./routes/orderRoutes");

const wishlistRoutes = require("./routes/wishlistRoutes");

 const addressRoutes = require("./routes/addressRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());

app.use(express.json());


app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/address", addressRoutes);

app.get("/", (req, res) => {
  res.send("JioMart Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});