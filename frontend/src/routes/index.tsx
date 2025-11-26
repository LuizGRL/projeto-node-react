import { Routes, Navigate, Route } from "react-router-dom";
import { LoginPage } from "../pages/Login";
import { PrivateRoute } from "./PrivateRoute";
import { MainLayout } from "../layouts/MainLayout";
import { LibraryMainPage } from "../pages/Library";
import { AccountsManagment } from "../pages/Accounts";
import { AuthorsManagment } from "../pages/Authors";
import { PublishersManagement } from "../pages/Publishers";


export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/library" element={<LibraryMainPage/>}/>
          <Route path="/accounts" element={<AccountsManagment/>}/>
          <Route path="/authors" element={<AuthorsManagment/>}/>
          <Route path="/publishers" element={<PublishersManagement/>}/>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};