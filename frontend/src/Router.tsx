import { useRoutes } from "react-router-dom";
import AppDrawer from "./components/internal/app-drawer";
import { lazy } from "react";
const DashboardPage = lazy(() => import("./pages/dashboard.page"));
const RegisterPage = lazy(() => import("./pages/register.page"));
const LoginPage = lazy(() => import("./pages/login.page"));
const ForgotPasswordPage = lazy(() => import("./pages/forgot-password.page"));
const ResetPasswordPage = lazy(() => import("./pages/reset-password.page"));
const NotFoundPage = lazy(() => import("./pages/not-found.page"));
const OrderPage = lazy(() => import("./pages/order.page"));
const ProductdPage = lazy(() => import("./pages/product.page"));
const ProductCategoryPage = lazy(() => import("./pages/product-category.page"));

function Router() {
  return useRoutes([
    {
      element: <AppDrawer />,
      path: "/",
      children: [
        {
          element: <DashboardPage />,
          index: true,
        },
        {
          element: <ProductdPage />,
          path: "product",
        },
        {
          element: <ProductCategoryPage />,
          path: "product-category",
        },
        {
          element: <OrderPage />,
          path: "order",
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
      path: "/reset-password/:forgotPasswordToken",
    },
    {
      element: <NotFoundPage />,
      path: "/*",
    },
  ]);
}

export default Router;
