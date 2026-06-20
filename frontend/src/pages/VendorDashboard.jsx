import { useState } from "react";
import axios from "axios";

function VendorDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Groceries");
  const [subcategory, setSubcategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/products",
        {
          title,
          description,
          category,
          subcategory,
          brand,
          price,
          stock,
          images: [imageUrl],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      alert("Product Added Successfully!");

      setTitle("");
      setDescription("");
      setCategory("Groceries");
      setSubcategory("");
      setBrand("");
      setPrice("");
      setStock("");
      setImageUrl("");

    } catch (error) {
      console.log(error.response?.data);

      alert(
        error.response?.data?.message ||
        "Failed to Add Product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md">

        <h1 className="text-3xl font-bold mb-8">
          Vendor Dashboard
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>
            <label className="block mb-2 font-medium">
              Product Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option>Groceries</option>
              <option>Fashion</option>
              <option>Home & Lifestyle</option>
              <option>Electronics</option>
              <option>Beauty & Personal Care</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Subcategory
            </label>

            <input
              type="text"
              value={subcategory}
              onChange={(e) =>
                setSubcategory(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Brand
            </label>

            <input
              type="text"
              value={brand}
              onChange={(e) =>
                setBrand(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Stock
            </label>

            <input
              type="number"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Image URL
            </label>

            <input
              type="text"
              value={imageUrl}
              onChange={(e) =>
                setImageUrl(e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Add Product
          </button>

        </form>

      </div>
    </div>
  );
}

export default VendorDashboard;