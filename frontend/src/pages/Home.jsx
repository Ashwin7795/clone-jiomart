import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Home() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-3xl font-bold mb-8">
          Products
        </h1>

        <div className="grid grid-cols-4 gap-6">

          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h2 className="font-bold text-lg">
                {product.title}
              </h2>

              <p className="text-gray-600">
                {product.brand}
              </p>

              <p className="font-bold text-red-600 mt-2">
                ₹{product.price}
              </p>

              <button
                className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Add to Cart
              </button>
            </div>
          ))}

        </div>

      </div>
    </>
  );
}

export default Home;