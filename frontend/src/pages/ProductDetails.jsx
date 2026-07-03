import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductRow from "../components/ProductRow";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [pincode, setPincode] = useState("577401"); 
  const [loading, setLoading] = useState(true);
  const [cartQuantity, setCartQuantity] = useState(0);
  const { fetchCart } = useCart();
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const isVendor = user?.role === "admin";

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const fetchProductData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        setProduct(res.data);

        const token = localStorage.getItem("token");

        if (token) {
          const cartRes = await axios.get(
            "http://localhost:5000/api/cart",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const cartItem = cartRes.data.items?.find(
            (item) =>
              item.productId?._id === res.data._id
          );

          if (cartItem) {
            setCartQuantity(cartItem.quantity);
          } else {
            setCartQuantity(0);
          }
        }

        const relatedRes = await axios.get(
          `http://localhost:5000/api/products/${id}/related`
        );

        setRelatedProducts(relatedRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartQuantity(1);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuantityChange = async (delta) => {
    const token = localStorage.getItem("token");
    const newQty = cartQuantity + delta;

    if (newQty < 1) {
      try {
        await axios.delete(
          "http://localhost:5000/api/cart/remove",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              productId: product._id,
            },
          }
        );

        setCartQuantity(0);
        fetchCart();
        return;
      } catch (error) {
        console.log(error);
      }
    }

    if (newQty > product.stock) {
      return;
    }

    try {
      await axios.put(
        "http://localhost:5000/api/cart/update",
        {
          productId: product._id,
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartQuantity(newQty);
      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <div className="text-center mt-20 text-sm font-bold text-gray-500 font-sans antialiased">Loading Product Deck...</div>;
  if (!product) return <div className="text-center mt-20 font-bold text-gray-600 font-sans antialiased">Product Missing</div>;

  return (
    <div className="bg-[#f6f6f7] min-h-screen font-sans antialiased text-gray-900 selection:bg-[#0078ad]/10">

      {/* Top Breadcrumb Navigation */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 pt-4 text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
        <span className="hover:text-[#0078ad] cursor-pointer">Home</span> 
        <span>&gt;</span> 
        <span className="hover:text-[#0078ad] cursor-pointer">{product.category}</span> 
        <span>&gt;</span> 
        <span className="text-gray-800 font-bold truncate max-w-[200px]">{product.title}</span>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex flex-col gap-8">
        
        {/* UPPER PANEL: Core Sticky Two-Column Details Deck */}
        <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT SIDE COLUMN: Image Stage View (Sticky Frame) */}
          <div className="w-full lg:w-[55%] bg-white rounded-2xl border border-gray-200/60 p-6 flex gap-4 sticky top-4">
            {/* Multi-Thumbnail Sidebar Picker Track */}
            <div className="flex flex-col gap-2 shrink-0">
              <div className="w-[54px] h-[54px] rounded-lg border-2 border-[#0078ad] p-1 flex items-center justify-center cursor-pointer bg-white">
                <img src={product.images?.[0]} alt="thumbnail" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
            {/* Hero Main Viewing Window */}
            <div className="flex-1 h-[360px] md:h-[440px] flex items-center justify-center p-4 relative bg-white">
              <img src={product.images?.[0]} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply" />
              <div className="absolute bottom-2 right-2 flex gap-1.5">
                <button type="button" className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-black flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors">&lt;</button>
                <button type="button" className="w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-black flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors">&gt;</button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE COLUMN: Buy Actions Floating Box Layout */}
          <div className="w-full lg:w-[45%] flex flex-col gap-4">
            <div className="w-full bg-white rounded-2xl border border-gray-200/60 p-6 flex flex-col gap-4 text-left">
              <div>
                <span className="text-[#0078ad] text-[12px] font-bold uppercase tracking-wider">{product.brand}</span>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug tracking-tight mt-1">{product.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="bg-[#f1a545] text-white text-[11px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    {product.rating?.toFixed(1) || "3.6"} ★
                  </div>
                  <span className="text-[12px] text-gray-400 font-medium">(448 Ratings)</span>
                </div>
              </div>

              {/* Exact JioMart Pricing Row Blocks */}
              <div className="border-t border-b border-gray-100 py-3 flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">₹{product.price}.00</span>
                  <span className="text-xs font-medium text-gray-400 line-through">MRP ₹{Math.round(product.price * 1.35)}.00</span>
                  <span className="text-[11px] bg-green-50 text-green-600 border border-green-100 px-1.5 py-0.5 rounded-md font-bold">Save 35%</span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Price inclusive of all taxes</p>
              </div>

              {/* Core Purchase Control Button System */}
              {isVendor ? (
                <button
                  type="button"
                  disabled
                  className="w-full h-[44px] bg-gray-100 text-gray-400 rounded-full font-bold text-sm cursor-not-allowed border border-gray-200/40"
                >
                  Admin Cannot Purchase Products
                </button>
              ) : product.stock === 0 ? (
                <button
                  type="button"
                  disabled
                  className="w-full h-[44px] bg-rose-50 text-rose-600 rounded-full font-bold text-sm border border-rose-100 cursor-not-allowed"
                >
                  Out Of Stock
                </button>
              ) : cartQuantity === 0 ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full h-[44px] bg-[#0078ad] hover:bg-[#0c5273] active:bg-[#00364e] text-white rounded-full font-bold text-sm shadow-xs transition-colors cursor-pointer"
                >
                  Add To Cart
                </button>
              ) : (
                <div className="w-full h-[44px] flex items-center justify-between px-6 bg-[#e5f1f7]/50 border border-[#0078ad]/10 rounded-full">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(-1)}
                    className="text-[#0078ad] text-xl font-bold h-full px-2 cursor-pointer hover:scale-110 transition-transform"
                  >
                    -
                  </button>

                  <div className="flex flex-col items-center justify-center">
                    <span className="font-bold text-sm text-[#0078ad]">
                      {cartQuantity}
                    </span>
                    {cartQuantity >= product.stock && (
                      <span className="text-[9px] text-red-500 font-bold tracking-tight uppercase">
                        Max Stock Reached
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuantityChange(1)}
                    disabled={cartQuantity >= product.stock}
                    className={`text-xl font-bold h-full px-2 transition-transform ${
                      cartQuantity >= product.stock
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-[#0078ad] cursor-pointer hover:scale-110"
                    }`}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Delivery address verification widget card */}
            <div className="w-full bg-white rounded-2xl border border-gray-200/60 p-5 text-left">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery Address</h3>
              <div className="flex gap-2 max-w-md">
                <input 
                  type="text" 
                  maxLength="6" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 h-10 bg-gray-50 border border-gray-200 rounded-xl px-4 text-xs font-bold text-gray-800 outline-none focus:border-[#0078ad] focus:border-2 transition-all"
                />
                <button type="button" className="text-[#0078ad] text-xs font-bold px-4 border border-[#0078ad]/30 bg-white rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">Change</button>
              </div>
              <p className="text-[12px] text-emerald-600 font-semibold mt-3 flex items-center gap-1.5 select-none">
                <span className="text-sm">✨</span> Standard Delivery Available
              </p>
            </div>
          </div>

        </div>

        {/* LOWER PANEL: Product Specs Metadata Information Table Grid */}
        <div className="w-full bg-white rounded-2xl border border-gray-200/60 p-6 flex flex-col gap-5">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2.5 text-left">Product Parameters</h3>
          <div className="w-full max-w-3xl border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-medium border-collapse">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3 bg-gray-50/50 text-gray-500 w-1/3 font-bold border-r border-gray-100">Brand</td>
                  <td className="p-3 font-semibold text-gray-800">{product.brand}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 bg-gray-50/50 text-gray-500 font-bold border-r border-gray-100">Category</td>
                  <td className="p-3 font-semibold text-gray-800">{product.category}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 bg-gray-50/50 text-gray-500 font-bold border-r border-gray-100">Sub-Classification</td>
                  <td className="p-3 font-semibold text-[#0078ad] hover:underline cursor-pointer">{product.subcategory}</td>
                </tr>
                <tr>
                  <td className="p-3 bg-gray-50/50 text-gray-500 font-bold border-r border-gray-100">In-Stock Volume</td>
                  <td className="p-3 font-semibold text-gray-800">{product.stock} Units Remaining</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-2 text-left">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description Overview</h4>
            <p className="text-xs md:text-sm text-gray-600 font-medium leading-relaxed max-w-4xl">{product.description}</p>
          </div>
        </div>

        {/* RECOMMENDATIONS TRACKS BLOCK - Fixed trailing gaps if arrays have less than 5 items */}
        <div className="-mx-4 md:mx-0 text-left space-y-4">
          {relatedProducts.length > 0 && (
            <ProductRow 
              title="You may also like" 
              products={relatedProducts.slice(0, 6)} 
            />
          )}
          {relatedProducts.length > 6 && (
            <ProductRow 
              title="Frequently Bought Together" 
              products={relatedProducts.slice(6, 12)} 
            />
          )}
        </div>

        {/* BOTTOM PANEL: Accurate Customer Reviews Summary Grid */}
        <div className="w-full bg-white rounded-2xl border border-gray-200/60 p-6 mb-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2.5 mb-5 text-left">Ratings & Reviews Summary</h3>
          <div className="flex flex-col sm:flex-row gap-8 items-center">
            <div className="text-center sm:border-r border-gray-100 pr-0 sm:pr-10 flex flex-col items-center shrink-0">
              <span className="text-4xl font-black text-gray-900 tracking-tight">{product.rating?.toFixed(1) || "3.6"}</span>
              <span className="text-[12px] text-gray-400 font-semibold mt-1.5">Out of 5 Stars</span>
            </div>
            <div className="flex-1 w-full max-w-xs flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3 text-[11px] font-semibold text-gray-400">
                  <span className="w-2 text-right">{stars}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-[#f1a545] h-full rounded-full transition-all duration-300" style={{ width: stars >= 4 ? "68%" : "18%" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default ProductDetails;