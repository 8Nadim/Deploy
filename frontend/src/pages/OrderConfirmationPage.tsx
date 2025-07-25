import { useLocation } from "react-router-dom";
import { useState } from "react";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const order = location.state?.order;
  const [paymentStatus, setPaymentStatus] = useState("");

  if (!order) {
    return <div className="p-6">No order details available.</div>;
  }

  const handlePayment = async () => {
    try {
      const res = await fetch("http://localhost:7000/api/orders/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          participantName: "User",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPaymentStatus("✅ Payment successful!");
      } else {
        setPaymentStatus(
          `❌ Payment failed: ${data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      setPaymentStatus("❌ Payment request failed.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Order Placed!</h1>
      <p>
        Your order ID is: <strong>{order._id}</strong>
      </p>

      <div className="bg-gray-100 p-4 rounded shadow">
        <p>
          <strong>Restaurant:</strong>{" "}
          {order.restaurantName || order.restaurantId || "Unknown"}
        </p>
        <p>
          <strong>Participants:</strong> {order.participants?.length ?? 0}
        </p>
        <p>
          <strong>Total:</strong> £
          {order.totalCost?.toFixed(2) ||
            order.totalPrice?.toFixed(2) ||
            "0.00"}
        </p>
      </div>

      <button
        onClick={handlePayment}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Pay Order
      </button>

      {paymentStatus && (
        <p className="mt-4 text-center text-sm text-gray-700">
          {paymentStatus}
        </p>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
