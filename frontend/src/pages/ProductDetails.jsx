import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );

      setProduct(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <h1>Loading...</h1>;
  }

const handleAddToCart = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/cart/add",
      {
        productId: product._id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Added To Cart!");

  } catch (error) {
    console.log(error.response?.data);

    alert(
      error.response?.data?.message ||
      "Failed To Add To Cart"
    );
  }
};
  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8">

        <div className="grid grid-cols-2 gap-10">

          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-full rounded-lg"
          />

          <div>

            <h1 className="text-4xl font-bold mb-4">
              {product.title}
            </h1>

            <p className="text-gray-600 mb-4">
              {product.brand}
            </p>

            <p className="text-3xl font-bold text-red-600 mb-6">
              ₹{product.price}
            </p>

            <p className="mb-6">
              {product.description}
            </p>

           <button
  onClick={handleAddToCart}
  className="bg-red-600 text-white px-8 py-3 rounded-lg"
>
  Add To Cart
</button>

          </div>

        </div>

      </div>
    </>
  );
}

export default ProductDetails;