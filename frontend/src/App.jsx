import {
  BrowserRouter,
  Routes,
  Route,
  Outlet
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 1. Layout Wrapper Component to bind the global architecture together
function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Pinned top navigation */}
      <Navbar />
      
      {/* Central viewport layout block with bottom cushioning defense */}
      <main className="flex-1 w-full pb-24">
        <Outlet />
      </main>
      
      {/* Isolated bottom footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes rendered without the global headers/footers */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Core application routes nested securely inside the Layout engine */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vendor" element={<VendorDashboard />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;