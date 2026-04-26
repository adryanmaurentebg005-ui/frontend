
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RegisterScreen from "./pages/user/auth/RegisterScreen.jsx";
import LoginScreen from "./pages/user/auth/LoginScreen.jsx";
import NavBar from "./NavBar";
import ItensScreen from "./pages/itens/ItensScreen";
import AddItemScreen from "./pages/itens/AddItemScreen";
import EditItemScreen from "./pages/itens/EditItemScreen";
import AddorderScreen from "./pages/orders/AddorderScreen";
import OrdersScreen from "./pages/orders/OrderScreen";
import EditOrderScreen from "./pages/orders/EditOrderScreen";
import ProfileScreen from "./pages/user/ProfileScreen";
import UserListScreen from "./pages/user/UserListScreen";
import EditUserScreen from "./pages/user/EditUserScreen";
import CouponScreen from "./pages/coupons/CouponScreen";
import AddCouponScreen from "./pages/coupons/AddCouponScreen";
import EditCouponScreen from "./pages/coupons/EditCouponScreen";

const getLoggedUser = () => {
  try {
    const storedUser = localStorage.getItem("loggedUser");
    if (!storedUser) {
      return null;
    }
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ element }) => {
  const loggedUser = getLoggedUser();
  return loggedUser?._id ? element : <Navigate to="/login" replace />;
};

const PublicOnlyRoute = ({ element }) => {
  const loggedUser = getLoggedUser();
  return loggedUser?._id ? <Navigate to="/itens" replace /> : element;
};

export default function App() {
  const [loggedUser, setLoggedUser] = useState(() => getLoggedUser());

  useEffect(() => {
    const syncAuth = () => setLoggedUser(getLoggedUser());

    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="flex h-screen flex-col overflow-hidden">
        <NavBar loggedUser={loggedUser} />
        <main className="min-h-0 flex-1 overflow-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<PublicOnlyRoute element={<LoginScreen />} />} />
            <Route path="/register" element={<PublicOnlyRoute element={<RegisterScreen />} />} />

            <Route path="/users" element={<ProtectedRoute element={<UserListScreen />} />} />
            <Route path="/users/novo" element={<ProtectedRoute element={<RegisterScreen />} />} />
            <Route path="/users/editar/:id" element={<ProtectedRoute element={<EditUserScreen />} />} />

            <Route path="/itens" element={<ProtectedRoute element={<ItensScreen />} />} />
            <Route path="/itens/novo" element={<ProtectedRoute element={<AddItemScreen />} />} />
            <Route path="/itens/editar/:id" element={<ProtectedRoute element={<EditItemScreen />} />} />

            <Route path="/orders" element={<ProtectedRoute element={<OrdersScreen />} />} />
            <Route path="/orders/novo" element={<ProtectedRoute element={<AddorderScreen />} />} />
            <Route path="/orders/editar/:id" element={<ProtectedRoute element={<EditOrderScreen />} />} />

            <Route path="/coupons" element={<ProtectedRoute element={<CouponScreen />} />} />
            <Route path="/coupons/novo" element={<ProtectedRoute element={<AddCouponScreen />} />} />
            <Route path="/coupons/editar/:id" element={<ProtectedRoute element={<EditCouponScreen />} />} />

            <Route path="/profile" element={<ProtectedRoute element={<ProfileScreen />} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}