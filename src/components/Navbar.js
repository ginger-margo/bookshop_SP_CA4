import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      {currentUser?.role === "admin" && <Link to="/admin">Admin Panel</Link>}

      {currentUser?.role === "customer" && <Link to="/home">Home</Link>}
      {" | "}
      {currentUser ? (
        <>
          <span>👤 {currentUser.email}</span>
          {" | "}
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          {" | "}
          <Link to="/register">Register</Link>
        </>
      )}
      {currentUser?.role === "customer" && (
        <Link to="/books">Browse Books</Link>
      )}
      {currentUser && (
        <>
          <Link to="/books">Books</Link> | <Link to="/cart">Cart</Link>
        </>
      )}
    </nav>
  );
}
