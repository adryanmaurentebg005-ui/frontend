
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RegisterScreen from "./pages/user/auth/RegisterScreen.jsx";
import LoginScreen from "./pages/user/auth/LoginScreen.jsx";
import NavBar from "./NavBar";
import ItensScreen from "./pages/itens/ItensScreen";
import AddItemScreen from "./pages/itens/AddItemScreen";
import AddorderScreen from "./pages/orders/AddorderScreen";
import OrdersScreen from "./pages/orders/OrderScreen";
import ProfileScreen from "./pages/user/ProfileScreen";

const PlaceholderPage = ({ title }) => (
  <div className="mx-auto flex h-full max-w-6xl items-center px-4">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen flex-col overflow-hidden">
        <NavBar />
        <main className="min-h-0 flex-1 overflow-auto bg-gray-50">
          <Routes>
            <Route path="/" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/itens" element={<ItensScreen />} />
            <Route path="/itens/novo" element={<AddItemScreen />} />
            <Route path="/orders" element={<OrdersScreen />} />
            <Route path="/orders/novo" element={<AddorderScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}