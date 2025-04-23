// Strategy Pattern: Sorting logic is implemented dynamically based on the selected strategy (sortBy value)
// The user can choose how to sort the data (by title, author, or price), and the correct strategy is applied at runtime

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");

  useEffect(() => {
    const fetchBooks = async () => {
      const querySnapshot = await getDocs(collection(db, "books"));
      const bookArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(bookArray);
    };

    fetchBooks();
  }, []);

  const filteredBooks = books
    .filter((book) =>
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
    <div style={{ padding: "2rem" }}>
      <h2>Book Catalogue (Admin)</h2>

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

      <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              background: "#fff",
              boxShadow: "0 0 5px rgba(0,0,0,0.05)"
            }}
          >
            <h4>{book.title}</h4>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Price:</strong> ${book.price}</p>
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            {/* TODO: add Edit/Delete */}
          </div>
        ))}
      </div>
    </div>
  );
}
