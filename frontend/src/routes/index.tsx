import { Routes, Navigate, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { PrivateRoute } from "./PrivateRoute";


export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};