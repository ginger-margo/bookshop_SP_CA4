import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const isBirthday = () => {
    if (!userData?.dob) return false;
    const today = new Date();
    const dob = new Date(userData.dob);
    return (
      today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()
    );
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price = isBirthday() ? item.price * 0.85 : item.price;
    return sum + price * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      alert("You must be logged in to place an order");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const insufficient = [];

      for (const item of cart) {
        const bookRef = doc(db, "books", item.id);
        const bookSnap = await getDoc(bookRef);

        if (!bookSnap.exists()) continue;

        const currentStock = bookSnap.data().stock ?? 0;

        if (currentStock < item.quantity) {
          insufficient.push(`${item.title} (available: ${currentStock})`);
        }
      }

      if (insufficient.length > 0) {
        alert("Not enough stock for:\n" + insufficient.join("\n"));
        return;
      }

      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        email: currentUser.email,
        items: cart,
        total: totalPrice,
        createdAt: serverTimestamp(),
      });

      for (const item of cart) {
        const bookRef = doc(db, "books", item.id);
        const bookSnap = await getDoc(bookRef);
        const currentStock = bookSnap.data().stock ?? 0;

        await updateDoc(bookRef, {
          stock: currentStock - item.quantity,
        });
      }

      clearCart();
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Something went wrong while placing the order.");
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
      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>
          Cart is empty. <Link to="/books">Browse books</Link>
        </p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item) => {
              const discountedPrice = isBirthday()
                ? (item.price * 0.85).toFixed(2)
                : item.price.toFixed(2);
              const totalItem =
                (isBirthday() ? item.price * 0.85 : item.price) * item.quantity;

              return (
                <li
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #ccc",
                    paddingBottom: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <h4>{item.title}</h4>
                  <p>Author: {item.author}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Price per book: ${discountedPrice}
                    {isBirthday() && (
                      <span style={{ color: "green" }}> 🎉 -15%</span>
                    )}
                  </p>
                  <p>Total: ${totalItem.toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <h3>
            Total:{" "}
            <span style={{ color: isBirthday() ? "green" : "black" }}>
              ${totalPrice.toFixed(2)}
              {isBirthday() && " 🎉 Birthday Discount Applied!"}
            </span>
          </h3>
          <button onClick={handlePlaceOrder}>Place Order</button>{" "}
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}
