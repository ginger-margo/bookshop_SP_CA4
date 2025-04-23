import BookForm from "../components/BookForm";
import BookList from "../components/BookList";

export default function Admin() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Only visible users to have admin as their role</p>
      <BookForm />  {/* Form to add a book */}
      <BookList /> {/* List of books */}
    </div>
  );
}
