import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchUsersAndOrders = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const userArray = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        uid: doc.id,
        ...doc.data(),
      }));
      setUsers(userArray);

      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const orderArray = ordersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderArray);
    };

    fetchUsersAndOrders();
  }, []);

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <h2>Customers & Orders</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users.map((user) => {
          const userOrders = orders.filter((o) => o.userId === user.uid);

          return (
            <li key={user.id} style={{ marginBottom: "2rem" }}>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>Orders:</strong>
              </p>

              {userOrders.length === 0 ? (
                <p>No orders.</p>
              ) : (
                <ul>
                  {userOrders.map((order) => (
                    <li key={order.id}>
                      <p>
                        <strong>Date:</strong>{" "}
                        {order.createdAt?.toDate().toLocaleString()}
                      </p>
                      <p>
                        <strong>Total:</strong> ${order.total.toFixed(2)}
                      </p>
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
