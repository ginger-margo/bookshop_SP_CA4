import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import AddBook from "./pages/admin/AddBook";
import Catalog from "./pages/admin/Catalog";
import Customers from "./pages/admin/Customers";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-book"
            element={
              <PrivateRoute adminOnly>
                <AddBook />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/catalog"
            element={
              <PrivateRoute adminOnly>
                <Catalog />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <PrivateRoute adminOnly>
                <Customers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <PrivateRoute adminOnly>
                <Customers />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
