import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function Cart() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const { currentUser } = useAuth();

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      alert("You must be logged in to place an order");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    try {
      // Check stock for each item
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

      // Create order
      await addDoc(collection(db, "orders"), {
        userId: currentUser.uid,
        email: currentUser.email,
        items: cart,
        total: totalPrice,
        createdAt: serverTimestamp(),
      });

      // Reduce stock for each book
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
      alert("Something went wrong while placing the order");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>
          Cart is empty. <Link to="/books">Browse books</Link>
        </p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item) => (
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
                <p>Price per book: ${item.price}</p>
                <p>Total: ${item.price * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>

          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <button onClick={handlePlaceOrder}>Place Order</button>
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}
