import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      // Fetch orders
      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(result);

      // Fetch user profile
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDocs(
        query(collection(db, "users"), where("uid", "==", currentUser.uid))
      );

      if (userSnap.empty) return;

      const userData = userSnap.docs[0].data();
      setAddress(userData.address || "");
      setDob(userData.dob || "");
    };

    fetchData();
  }, [currentUser]);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        address,
        dob,
      });
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <h2>My Profile</h2>

      {editMode ? (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Address:
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ marginLeft: "1rem" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Date of Birth:
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                style={{ marginLeft: "1rem" }}
              />
            </label>
          </div>
          <button onClick={handleSaveProfile}>Save</button>{" "}
          <button onClick={() => setEditMode(false)}>Сancel</button>
        </>
      ) : (
        <>
          <p>
            <strong>Email:</strong> {currentUser?.email}
          </p>
          <p>
            <strong>Address:</strong> {address || "Not set"}
          </p>
          <p>
            <strong>Date of Birth:</strong> {dob || "Not set"}
          </p>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}

      <hr />

      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} style={{ marginBottom: "1rem" }}>
              <p>
                <strong>Order ID:</strong> {order.id}
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
    </div>
  );
}
