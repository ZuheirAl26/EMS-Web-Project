import { Routes, Route, useLocation } from "react-router-dom";
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
  const location = useLocation();
  let background = location.state?.background;

  const modalRoutes = [
    "/forgot-password",
    "/reset-password",
    "/change-password",
  ];
  if (!background && modalRoutes.includes(location.pathname)) {
    background = { pathname: "/login", search: "", hash: "", state: null };
  }

  return (
    <>
      {/* <Route element={<GuestRoute />}> */}
      <Routes location={background || location}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyAccountPage />} />

        {/* <Route element={<ProtectedRoute />}> */}
        <Route
          path="/dashboard"
          element={<div>Welcome to your Dashboard!</div>}
        />
        {/* </Route> */}

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>

      {background && (
        <Routes>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Routes>
      )}
    </>
  );
};
