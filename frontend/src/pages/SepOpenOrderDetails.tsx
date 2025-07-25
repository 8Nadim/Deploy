import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

export default function OpenOrderDetailsPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("userId");
  const name = searchParams.get("name");

  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(
          `http://localhost:7000/api/open-orders/${orderId}`
        );
        if (!res.ok) throw new Error("Failed to fetch open order details");
        const json = await res.json();
        setOrder(json.data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchOrder();
  }, [orderId]);

  const leaveOrder = async () => {
    if (!userId) {
      alert("User ID missing. Cannot leave order.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:7000/api/open-orders/${orderId}/leave`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to leave order");
      }
      alert("You have left the order.");
      navigate("/open-orders");
    } catch (err: any) {
      alert(`Error leaving order: ${err.message}`);
    }
  };

  if (error)
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!order) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Open Order Details</h2>
      <p>
        <strong>Order ID:</strong> {order._id}
      </p>
      <p>
        <strong>Restaurant:</strong> {order.restaurantName}
      </p>
      <p>
        <strong>Host:</strong> {order.host}
      </p>
      <p>
        <strong>Total Cost:</strong> £{order.totalCost.toFixed(2)}
      </p>
      <p>
        <strong>Delivery Location:</strong> {order.deliveryLocation}
      </p>
      <p>
        <strong>Participants:</strong> {order.participants.length}
      </p>
      <p className="mt-4 text-sm text-gray-600">
        You are logged in as <strong>{name}</strong> (ID: {userId})
      </p>

      <button
        onClick={leaveOrder}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Leave Order
      </button>
    </div>
  );
}

//this page may be excessive
