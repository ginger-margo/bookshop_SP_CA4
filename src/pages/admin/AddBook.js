import BookForm from "../../components/BookForm";

export default function AddBook() {
  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <h2>Add Book</h2>
      <BookForm />
    </div>
  );
}
