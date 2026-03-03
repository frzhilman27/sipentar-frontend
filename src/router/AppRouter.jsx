import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Laporan from "../pages/Laporan";

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute roleRequired="admin"><Dashboard /></ProtectedRoute>} />
        <Route path="/laporan" element={<ProtectedRoute roleRequired="user"><Laporan /></ProtectedRoute>} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
