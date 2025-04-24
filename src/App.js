import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute";
import AddBook from "./pages/admin/AddBook";
import Catalog from "./pages/admin/Catalog";
import Customers from "./pages/admin/Customers";
import Books from "./pages/customer/Books";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/customer/Cart";
import Home from "./pages/customer/Home";

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Redirect root route based on role */}
      <Route
        path="/"
        element={
          currentUser?.role === "admin" ? (
            <Navigate to="/admin" />
          ) : (
            <Navigate to="/home" />
          )
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
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

      {/* Customer Routes */}
      <Route path="/books" element={<Books />} />
      <Route path="/cart" element={<Cart />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
