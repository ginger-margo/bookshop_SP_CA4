import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();

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
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}
