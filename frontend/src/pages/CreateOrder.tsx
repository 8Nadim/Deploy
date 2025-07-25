import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateOrder() {
  const [restaurantId, setRestaurantId] = useState("");
  const [host, setHost] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      restaurantName: restaurantId,
      host,
      totalCost: parseFloat(totalPrice),
      deliveryLocation,
      isClosed: false,
      participants: [],
    };

    try {
      let res;
      if (isOpenOrder) {
        // Create Open Order
        res = await fetch("http://localhost:7000/api/open-orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // Create Normal Order
        res = await fetch("http://localhost:7000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (!res.ok) throw new Error("Failed to create order");

      const json = await res.json();

      if (isOpenOrder) {
        // Redirect to Open Order Details page
        navigate(
          `/open-orders/${json.data._id}?userId=${encodeURIComponent(
            host
          )}&name=${encodeURIComponent(host)}`
        );
      } else {
        // Redirect to Normal Order Details page
        navigate(
          `/orders/${json.data._id}?userId=${encodeURIComponent(
            host
          )}&name=${encodeURIComponent(host)}`
        );
      }
    } catch (err) {
      alert("Error creating order: " + (err as Error).message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Restaurant ID
          <input
            type="text"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
            required
            className="w-full mt-1 border px-2 py-1 rounded"
          />
        </label>
        <label className="block">
          Host Name
          <input
            type="text"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            required
            className="w-full mt-1 border px-2 py-1 rounded"
          />
        </label>
        <label className="block">
          Total Price (£)
          <input
            type="number"
            step="0.01"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e.target.value)}
            required
            className="w-full mt-1 border px-2 py-1 rounded"
          />
        </label>
        <label className="block">
          Delivery Location
          <input
            type="text"
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            required
            className="w-full mt-1 border px-2 py-1 rounded"
          />
        </label>
        <label className="block flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isOpenOrder}
            onChange={() => setIsOpenOrder(!isOpenOrder)}
          />
          <span>Make this an Open Order</span>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Order
        </button>
      </form>
    </div>
  );
}
