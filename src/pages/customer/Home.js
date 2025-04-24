import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(result);
    };

    fetchOrders();
  }, [currentUser]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Past Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} style={{ marginBottom: "1rem" }}>
              <p><strong>Date:</strong> {order.createdAt?.toDate().toLocaleString()}</p>
              <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.title} — {item.quantity} × ${item.price}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
