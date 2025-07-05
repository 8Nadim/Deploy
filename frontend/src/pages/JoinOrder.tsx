// src/pages/JoinOrder.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function JoinOrder() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [error, setError] = useState("");

  const userId = "679d756c2de0b9feee5ff651"; // replace with Auth0 later

  const [name, setName] = useState("");
  const [item, setItem] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch("http://localhost:7000/api/open-order");
        const data = await res.json();
        const found = data.data.find((o: any) => o._id === orderId);
        if (found) setOrderInfo(found);
        else setError("Order not found.");
      } catch (err) {
        setError("Failed to load order.");
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleJoin = async () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!item.trim()) {
      setError("Please enter your order item.");
      return;
    }

    try {
      const res = await fetch("http://localhost:7000/api/open-order/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          userId,
          name,
          items: [{ name: item, price: 0 }],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Join failed");

      alert("Successfully joined order!");
      navigate("/open-orders");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) return <p className="p-4 text-red-600">{error}</p>;

  if (!orderInfo) return <p className="p-4">Loading order details...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Join Order</h2>
      <p>
        <strong>Host:</strong> {orderInfo.host}
      </p>
      <p>
        <strong>Delivery:</strong> {orderInfo.deliveryLocation}
      </p>
      <p>
        <strong>Total:</strong> £{orderInfo.totalPrice}
      </p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="mt-4 p-2 w-full border rounded"
      />

      <input
        type="text"
        value={item}
        onChange={(e) => setItem(e.target.value)}
        placeholder="What are you ordering?"
        className="mt-4 p-2 w-full border rounded"
      />

      <button
        onClick={handleJoin}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Confirm Join
      </button>
    </div>
  );
}
