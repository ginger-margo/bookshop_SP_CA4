import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

export default function BookDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const bookRef = doc(db, "books", id);
      const bookSnap = await getDoc(bookRef);
      if (bookSnap.exists()) {
        setBook({ id: bookSnap.id, ...bookSnap.data() });
      }

      const reviewsSnapshot = await getDocs(
        query(collection(db, "reviews"), where("bookId", "==", id))
      );
      setReviews(reviewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      if (currentUser) {
        const ordersSnapshot = await getDocs(
          query(collection(db, "orders"), where("userId", "==", currentUser.uid))
        );
        const orders = ordersSnapshot.docs.map((doc) => doc.data());

        const hasBook = orders.some((order) =>
          order.items.some((item) => item.id === id)
        );
        setCanReview(hasBook);
      }
    };

    fetchData();
  }, [id, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("You must be logged in to review");

    await addDoc(collection(db, "reviews"), {
      bookId: id,
      userId: currentUser.uid,
      email: currentUser.email,
      rating: parseInt(rating),
      comment,
      createdAt: serverTimestamp(),
    });

    setRating(5);
    setComment("");
    alert("Review submitted!");

    const snapshot = await getDocs(
      query(collection(db, "reviews"), where("bookId", "==", id))
    );
    setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Price:</strong> ${book.price}</p>
      {book.imageUrl && (
        <img
          src={book.imageUrl}
          alt={book.title}
          style={{ width: "200px", marginTop: "1rem" }}
        />
      )}
      <p><strong>Category:</strong> {book.category}</p>

      <hr />

      <h3>Leave a Review</h3>

      {canReview ? (
        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label><br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review"
            rows="3"
          /><br />
          <button type="submit">Submit Review</button>
        </form>
      ) : (
        <p style={{ fontStyle: "italic" }}>
          You can only review books you've purchased.
        </p>
      )}

      <hr />

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((r) => (
            <li key={r.id} style={{ marginBottom: "1rem" }}>
              <strong>{r.email}</strong> rated {r.rating}/5
              <p>{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
