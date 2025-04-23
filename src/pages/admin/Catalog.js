// Strategy Pattern: Sorting logic is implemented dynamically based on the selected strategy (sortBy value)
// The user can choose how to sort the data (by title, author, or price), and the correct strategy is applied at runtime

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");
  const [editedStock, setEditedStock] = useState(0);

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

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this book?"
    );
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "books", id));
      setBooks((prev) => prev.filter((book) => book.id !== id));
      alert("Book deleted.");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setEditedTitle(book.title);
    setEditedAuthor(book.author);
    setEditedStock(book.stock ?? 0);
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(db, "books", id), {
        title: editedTitle,
        author: editedAuthor,
        stock: parseInt(editedStock),
      });

      setBooks((prev) =>
        prev.map((book) =>
          book.id === id
            ? {
                ...book,
                title: editedTitle,
                author: editedAuthor,
                stock: parseInt(editedStock),
              }
            : book
        )
      );

      setEditingId(null);
      alert("Book updated.");
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book.");
    }
  };

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

      <div
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {filteredBooks.map((book) => (
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
            {editingId === book.id ? (
              <>
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <input
                  value={editedAuthor}
                  onChange={(e) => setEditedAuthor(e.target.value)}
                />
                <input
                  type="number"
                  value={editedStock}
                  onChange={(e) => setEditedStock(e.target.value)}
                  placeholder="Stock"
                />
                <button onClick={() => handleSave(book.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h4>{book.title}</h4>
                <p>
                  <strong>Author:</strong> {book.author}
                </p>
                <p>
                  <strong>Price:</strong> ${book.price}
                </p>
                <p>
                  <strong>Category:</strong> {book.category}
                </p>
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <p>
                  <strong>Stock:</strong> {book.stock ?? 0}
                </p>
                <button onClick={() => handleEdit(book)}>✏️</button>
                <button onClick={() => handleDelete(book.id)}>🗑</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
