import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./BookList.css";

export default function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksArray);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h3>Book Catalogue</h3>
      {books.length === 0 ? (
        <p>No books yet.</p>
      ) : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
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
              <p>
                <strong>Price:</strong> ${book.price}
              </p>
              <p>
                <strong>Category:</strong> {book.category}
              </p>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
