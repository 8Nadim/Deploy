import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:7000", { withCredentials: true });

interface Participant {
  name?: string;
  items: any[];
  amountOwed?: number;
  userId?: string;
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
  const [error, setError] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { name: string; message: string }[]
  >([]);
  const [chatInput, setChatInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const userIdParam = searchParams.get("userId");
  const userNameParam = searchParams.get("name");

  const userId = userIdParam || localStorage.getItem("userId") || "";
  const userName = userNameParam || localStorage.getItem("userName") || "";

  useEffect(() => {
    if (userIdParam) localStorage.setItem("userId", userIdParam);
    if (userNameParam) localStorage.setItem("userName", userNameParam);
  }, [userIdParam, userNameParam]);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        console.log(
          `[OrderDetailsPage] Fetching open order ${orderId} for user ${userId}`
        );
        // Try open order first
        let res = await fetch(
          `http://localhost:7000/api/open-orders/${orderId}?userId=${userId}`
        );

        if (res.status === 403) {
          setError("Access denied. You must join this order to view details.");
          return;
        }

        if (res.ok) {
          const response = await res.json();
          console.log("[OrderDetailsPage] Open order response:", response);

          // Support both { data: {...} } or {...} response formats
          const orderData = response.data ?? response;
          setIsOpenOrder(true);
          setOrder(orderData);
          return;
        }

        console.log(
          `[OrderDetailsPage] Open order fetch failed with status: ${res.status}, falling back to normal order`
        );

        // Fallback to normal order
        res = await fetch(`http://localhost:7000/api/orders/${orderId}`);
        if (!res.ok) {
          setError("Failed to fetch order details.");
          return;
        }

        const response = await res.json();
        console.log("[OrderDetailsPage] Normal order response:", response);

        setIsOpenOrder(false);
        setOrder(response);
      } catch (err) {
        console.error("[OrderDetailsPage] Error fetching order details:", err);
        setError("Error fetching order details.");
      }
    };

    fetchOrder();
  }, [orderId, userId]);

  useEffect(() => {
    if (!orderId || error || !isOpenOrder) return;

    socket.emit("join-room", orderId);

    socket.on("chat-message", (msg) => {
      setChatMessages((prev) => [...prev, msg]);
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        50
      );
    });

    return () => {
      socket.off("chat-message");
    };
  }, [orderId, error, isOpenOrder]);

  const sendChatMessage = () => {
    if (chatInput.trim() && order && isOpenOrder) {
      socket.emit("chat-message", {
        roomId: orderId,
        name: userName || "Unknown",
        message: chatInput,
      });
      setChatInput("");
    }
  };

  const handlePayment = async () => {
    if (!order) return;
    try {
      const res = await fetch("http://localhost:7000/api/orders/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order._id,
          participantName: userName || "User",
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
    } catch {
      setPaymentStatus("❌ Payment request failed.");
    }
  };

  const handleLeaveOrder = async () => {
    if (!orderId || !userId) return;

    try {
      const res = await fetch(
        `http://localhost:7000/api/open-orders/${orderId}/leave`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Leave order failed");

      alert("You have left the order.");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      navigate("/open-orders");
    } catch (err: any) {
      alert(`Error leaving order: ${err.message}`);
    }
  };

  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!order) return <p className="p-4">Loading order details...</p>;

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
            <strong>Status:</strong>{" "}
            {order.status === "closed" ? "Closed" : "Normal"}
          </p>
        </>
      )}

      <div>
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
        <>
          <div>
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
          {isOpenOrder && (
            <button
              onClick={handleLeaveOrder}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Leave Order
            </button>
          )}
        </>
      )}

      {isOpenOrder && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Chat</h2>
          <div className="h-40 overflow-y-auto border rounded p-2 bg-gray-50">
            {chatMessages.map((msg, i) => (
              <div key={i}>
                <strong>{msg.name}:</strong> {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex mt-2">
            <input
              className="flex-1 border p-2 rounded-l"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") sendChatMessage();
              }}
            />
            <button
              onClick={sendChatMessage}
              className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
