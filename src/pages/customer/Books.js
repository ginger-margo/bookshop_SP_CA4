import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchBooksAndUser = async () => {
      // Fetch books
      const querySnapshot = await getDocs(collection(db, "books"));
      const bookArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(bookArray);

      // Fetch user data
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };

    fetchBooksAndUser();
  }, [currentUser]);

  const isBirthday = () => {
    if (!userData?.dob) return false;
    const today = new Date();
    const dob = new Date(userData.dob);
    return (
      today.getDate() === dob.getDate() && today.getMonth() === dob.getMonth()
    );
  };

  // Strategy Pattern: Dynamically applies sorting strategy based on user selection
  const filteredBooks = books
    .filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      return 0;
    });

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <h2>Browse Books</h2>

      <input
        type="text"
        placeholder="Search by title or author"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginRight: "1rem" }}
      />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="title">Sort by Title (A–Z)</option>
        <option value="author">Sort by Author (A–Z)</option>
        <option value="price">Sort by Price (low to high)</option>
      </select>

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredBooks.map((book) => {
          const hasBirthdayDiscount = isBirthday();
          const finalPrice = hasBirthdayDiscount
            ? (book.price * 0.85).toFixed(2)
            : book.price;

          return (
            <div
              key={book.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                background: "#fff",
                boxShadow: "0 0 5px rgba(0,0,0,0.05)",
              }}
            >
              {book.imageUrl && (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                    marginBottom: "0.5rem",
                    borderRadius: "4px",
                  }}
                />
              )}
              <h4>{book.title}</h4>
              <p>
                <strong>Author:</strong> {book.author}
              </p>

              {hasBirthdayDiscount ? (
                <p>
                  <strong>Price:</strong>{" "}
                  <span
                    style={{ textDecoration: "line-through", color: "gray" }}
                  >
                    ${book.price}
                  </span>{" "}
                  <strong style={{ color: "green" }}>
                    ${finalPrice} 🎉 Birthday Discount!
                  </strong>
                </p>
              ) : (
                <p>
                  <strong>Price:</strong> ${book.price}
                </p>
              )}

              <p>
                <strong>Category:</strong> {book.category}
              </p>
              <p>
                <strong>Stock:</strong> {book.stock ?? 0}
              </p>
              <Link to={`/books/${book.id}`}>View Details</Link>
              <button onClick={() => addToCart(book)}>Add to Cart</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
