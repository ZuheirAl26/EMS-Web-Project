import { Routes, Route, useLocation } from "react-router-dom";
import {
  ChangePasswordPage,
  CheckEmailPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyAccountPage,
} from "../features/ExhibitorAuth/pages";
import {
  AddServicesPage,
  CompanyProfilePage,
  CreateBoothPlanPage,
  ReviewSubmitPage,
} from "../features/CreateBoothPlan/pages";
import { MyBoothsPage } from "../features/MyBooths/pages";
import { ExhibitorProfilePage } from "../features/ExhibitorProfile/pages";
import { EventRequestPage, EventsPage } from "../features/Events/pages";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoute } from "./guards";
import TeamPage from "../features/Team&Staff/pages/TeamPage";

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
        {/* <Route path="/" element={<LandingPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/check-email" element={<CheckEmailPage />} />
        <Route path="/verify-email" element={<VerifyAccountPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard/booths/create"
            element={<CreateBoothPlanPage />}
          />
          <Route
            path="/dashboard/booths/create/services"
            element={<AddServicesPage />}
          />
          <Route
            path="/dashboard/booths/create/company"
            element={<CompanyProfilePage />}
          />
          <Route
            path="/dashboard/booths/create/review"
            element={<ReviewSubmitPage />}
          />
          <Route
            path="/dashboard/events/request"
            element={<EventRequestPage />}
          />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="booths" element={<MyBoothsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="profile" element={<ExhibitorProfilePage />} />
            <Route path="*" element={null} />
          </Route>
        </Route>

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
