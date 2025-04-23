import BookList from "../../components/BookList";

export default function Catalog() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Book Catalogue</h2>
      <p>Search, sort, and edit books here</p>
      <BookList />
    </div>
  );
}
