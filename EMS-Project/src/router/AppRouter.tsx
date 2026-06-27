import { Routes, Route } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "./guards";
import {
  ChangePasswordPage,
  CheckEmailPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyAccountPage,
} from "../features/ExhibitorAuth/pages";

export const AppRouter = () => {
  return (
    <Routes>
      {/* <Route element={<GuestRoute />}> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/verify-email" element={<VerifyAccountPage />} />

      {/* <Route element={<ProtectedRoute />}> */}
      {/* <Route element={<ExhibitorLayout />}> */}
      <Route path="/dashboard" element={<div>Hi</div>} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      {/* <Route path="/profile" element={<ExhibitorProfilePage />} /> */}
      {/* </Route> */}

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
};
