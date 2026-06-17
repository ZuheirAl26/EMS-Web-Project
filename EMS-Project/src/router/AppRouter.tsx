import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/ExhibitorAuth/pages/LoginPage";
import RegisterPage from "../features/ExhibitorAuth/pages/RegisterPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
