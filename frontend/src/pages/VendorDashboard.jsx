import { useState, useEffect } from "react";
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


  const handleEdit = async (product) => {
  const newTitle = prompt(
    "Enter new title",
    product.title
  );

  if (!newTitle) return;

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/products/${product._id}`,
      {
        ...product,
        title: newTitle,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Product Updated Successfully!");

    fetchProducts();

  } catch (error) {
    console.log(error.response?.data);

    alert(
      error.response?.data?.message ||
      "Update Failed"
    );
  }
};

const handleDelete = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Product Deleted Successfully!");

    fetchProducts();

  } catch (error) {
    console.log(error.response?.data);

    alert(
      error.response?.data?.message ||
      "Delete Failed"
    );
  }
};
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

      fetchProducts();

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

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">
            My Products
          </h2>

          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 mb-4"
            >
              <h3 className="font-bold text-lg">
                {product.title}
              </h3>

              <p>{product.brand}</p>

              <p>₹{product.price}</p>

              <p>Stock: {product.stock}</p>
              <button
  onClick={() => handleEdit(product)}
  className="mt-3 mr-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  Edit
</button>
              <button
  onClick={() => handleDelete(product._id)}
  className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
>
  Delete
</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default VendorDashboard;