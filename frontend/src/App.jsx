import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import OtpLogin from "./pages/OtpLogin";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import Wishlist from "./pages/Wishlist";
import FloatingCart from "./components/FloatingCart";
function MainLayout() {
 
  const location = useLocation();
  const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));
const isAdmin = user?.role === "admin";

  const isCartPage = location.pathname === "/cart";
   useEffect(() => {
 if (
  isAdmin &&
  location.pathname !== "/admin" &&
  !location.pathname.startsWith("/orders/")
) {
  navigate("/admin");
}
}, [isAdmin, location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      {/* Pass a special flag to the Navbar so it knows whether to hide sub-navigation blocks */}
     {!isAdmin && (
  <Navbar hideSubNav={isCartPage} />
)}
      
    {!isAdmin && <FloatingCart />}
      <main className="flex-1 w-full pb-24">
        <Outlet />
      </main>
      
      {/* If we are on the cart page path, completely remove the footer component tree */}
      {!isCartPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-login" element={<OtpLogin />} />
          

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
        </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;