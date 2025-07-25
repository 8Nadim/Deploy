import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Order = {
  _id: string;
  restaurantId: string;
  host: string;
  deliveryLocation: string;
  participants?: any[];
  totalPrice?: number;
  isClosed?: boolean;
};

const OpenOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch open orders from backend
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/open-orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Open Orders</h1>
      {orders.length === 0 ? (
        <p>No open orders right now.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="mb-4 border p-4 rounded-lg shadow bg-white"
          >
            <h3 className="text-lg font-semibold">{order.host}</h3>
            <p className="text-sm text-gray-600">
              Delivery to: {order.deliveryLocation}
            </p>
            <div className="flex space-x-2 mt-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() =>
                  navigate(
                    `/join-order/${order._id}?userId=demouserid&name=DemoUser`
                  )
                }
              >
                Join Order
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() =>
                  navigate(
                    `/order-details/${order._id}?userId=demouserid&name=DemoUser`
                  )
                }
              >
                View Details
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OpenOrders;
