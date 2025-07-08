import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Participant {
  name?: string;
  items: any[];
  amountOwed?: number;
}

interface OrderData {
  _id: string;
  restaurantId: any;
  host?: string;
  participants: Participant[];
  totalPrice?: number;
  totalCost?: number;
  deliveryLocation?: string;
  collectionPoint?: string;
  isClosed?: boolean;
  status?: "closed" | "completed";
  createdAt: string;
  isOpenOrder?: boolean;
}

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isOpenOrder, setIsOpenOrder] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        console.log("[Frontend] Fetching normal order with ID:", orderId);
        let res = await fetch(`http://localhost:7000/api/orders/${orderId}`);

        if (res.ok) {
          const data = await res.json();
          console.log("[Frontend] Normal order fetched:", data);

          setIsOpenOrder(data.isOpenOrder ?? false);
          setOrder({ ...data });
          return;
        }

        console.log(
          "[Frontend] Normal order not found, trying open order:",
          orderId
        );
        res = await fetch(`http://localhost:7000/api/open-orders/${orderId}`);

        if (res.ok) {
          const data = await res.json();
          console.log("[Frontend] Open order fetched:", data);
          setIsOpenOrder(true);
          setOrder({ ...data, isOpenOrder: true });
          return;
        }

        console.error("[Frontend] Order not found for ID:", orderId);
      } catch (err) {
        console.error("[Frontend] Failed to fetch order:", err);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handlePayment = async () => {
    if (!order) return;
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
    } catch (err) {
      setPaymentStatus("❌ Payment request failed.");
    }
  };

  if (!order) return <div className="p-8">Loading order details...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold">Order Details</h1>
      <p>
        <strong>Restaurant ID:</strong> {order.restaurantId}
      </p>

      {isOpenOrder ? (
        <>
          <p>
            <strong>Host:</strong> {order.host ?? "N/A"}
          </p>
          <p>
            <strong>Delivery Location:</strong>{" "}
            {order.deliveryLocation ?? "N/A"}
          </p>
          <p>
            <strong>Total Price:</strong> £
            {order.totalPrice?.toFixed(2) ?? "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {order.isClosed ? "Closed" : "Open"}
          </p>
        </>
      ) : (
        <>
          <p>
            <strong>Collection Point:</strong> {order.collectionPoint ?? "N/A"}
          </p>
          <p>
            <strong>Total Cost:</strong> £{order.totalCost?.toFixed(2) ?? "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {order.status ?? "N/A"}
          </p>
        </>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Participants:</h2>
        {order.participants?.length === 0 ? (
          <p>No participants</p>
        ) : (
          <ul className="list-disc list-inside">
            {order.participants.map((p, idx) => (
              <li key={idx}>
                {p.name ?? "Anonymous"} — Items: {p.items.length} — £
                {p.amountOwed?.toFixed(2) ?? "0.00"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!order.isClosed && (
        <div className="mt-4">
          <button
            onClick={handlePayment}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pay Order
          </button>
          {paymentStatus && (
            <p className="mt-2 text-sm text-gray-700">{paymentStatus}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
