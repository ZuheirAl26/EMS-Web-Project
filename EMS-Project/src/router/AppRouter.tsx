import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/ExhibitorAuth/pages/LoginPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
