import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function OrderDetails() {

  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(

        `http://localhost:5000/api/orders/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      setOrder(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  if (!order) {

    return <h1 className="text-center mt-20">Loading...</h1>;

  }

  return (

    <div className="max-w-6xl mx-auto py-10">

      <div className="bg-white rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-8">
          Order Details
        </h1>

        <h2 className="text-xl font-bold mb-5">
          Products
        </h2>

        {order.products.map((item) => (

          <div
            key={item._id}
            className="flex justify-between items-center border-b py-5"
          >

            <div className="flex gap-5">

              <img
                src={item.productId.images[0]}
                alt={item.productId.title}
                className="w-20 h-20 object-contain"
              />

              <div>

                <h3 className="font-bold">

                  {item.productId.title}

                </h3>

                <p>

                  Quantity : {item.quantity}

                </p>

              </div>

            </div>

            <h3 className="font-bold">

              ₹{item.price * item.quantity}

            </h3>

          </div>

        ))}

        <div className="mt-10">

          <h2 className="text-xl font-bold mb-4">

            Shipping Address

          </h2>

          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}</p>
          <p>{order.shippingAddress.state}</p>
          <p>{order.shippingAddress.pincode}</p>

        </div>

        <div className="mt-10">

          <h2 className="text-xl font-bold">

            Order Status
          </h2>

          <div className="mt-4">

            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">

              {order.status}

            </span>

          </div>

        </div>

      </div>

    </div>

  );

}

export default OrderDetails;