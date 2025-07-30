import { useRoutes } from "react-router-dom";
import AppDrawer from "./components/internal/app-drawer";
import { lazy } from "react";
const DashboardPage = lazy(() => import("./pages/dashboard.page"));
const RegisterPage = lazy(() => import("./pages/register.page"));
const LoginPage = lazy(() => import("./pages/login.page"));
const ForgotPasswordPage = lazy(() => import("./pages/forgot-password.page"));
const ResetPasswordPage = lazy(() => import("./pages/reset-password.page"));

function Router() {
  return useRoutes([
    {
      element: <AppDrawer />,
      children: [
        {
          element: <DashboardPage />,
          index: true,
        },
      ],
    },
    {
      element: <RegisterPage />,
      path: "/register",
    },
    {
      element: <LoginPage />,
      path: "/login",
    },
    {
      element: <ForgotPasswordPage />,
      path: "/forgot-password",
    },
    {
      element: <ResetPasswordPage />,
      path: "/reset-password/:token",
    },
  ]);
}

export default Router;
