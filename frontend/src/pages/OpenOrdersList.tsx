import { useNavigate } from "react-router-dom";

interface Order {
  _id: string;
  restaurantId: string;
  isOpenOrder: boolean;
  isClosed: boolean;
  deliveryLocation?: string;
}

const OpenOrdersList = () => {
  const navigate = useNavigate();

  // Hardcoded orders array —
  const orders: Order[] = [
    {
      _id: "openorder123",
      restaurantId: "Demo Open Pizza Place",
      isOpenOrder: true,
      isClosed: false,
      deliveryLocation: "Demo Street",
    },
    {
      _id: "closedorder456",
      restaurantId: "Demo Closed Pizza Place",
      isOpenOrder: true,
      isClosed: true,
      deliveryLocation: "Demo Street",
    },
  ];

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Open Orders List (Demo)</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="p-4 border rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{order.restaurantId}</p>
            <p>Status: {order.isClosed ? "Closed" : "Open"}</p>
            <p>Delivery Location: {order.deliveryLocation}</p>
          </div>

          {order.isOpenOrder && !order.isClosed && (
            <button
              onClick={() => navigate(`/join-order/${order._id}`)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Join Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default OpenOrdersList;
