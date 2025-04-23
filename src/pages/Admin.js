import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel</h1>
      <p>Choose an action:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button onClick={() => navigate("/admin/add-book")}>
          Add Book
        </button>
        <button onClick={() => navigate("/admin/catalog")}>
          View & Manage Book Catalogue
        </button>
        <button onClick={() => navigate("/admin/customers")}>
          View Customers & Orders
        </button>
      </div>
    </div>
  );
}
