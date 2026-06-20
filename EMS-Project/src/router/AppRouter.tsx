import { Routes, Route } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "./guards";
import CheckEmailPage from "../features/ExhibitorAuth/pages/AuthPages/CheckEmailPage";
import LoginPage from "../features/ExhibitorAuth/pages/AuthPages/LoginPage";
import RegisterPage from "../features/ExhibitorAuth/pages/AuthPages/RegisterPage";
import VerifyAccountPage from "../features/ExhibitorAuth/pages/AuthPages/VerifyAccountPage";

export const AppRouter = () => {
  return (
    <Routes>
      {/* <Route element={<GuestRoute />}> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
      {/* </Route> */}

      {/* <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<div>Welcome to your Dashboard!</div>}
        />
      </Route> */}

      {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
      <Route path="/verify-email" element={<VerifyAccountPage />} />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
