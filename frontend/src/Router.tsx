import { useRoutes } from "react-router-dom";
import AdminAppDrawer from "./components/internal/admin-app-drawer";
import { lazy } from "react";
import CustomerAppDrawer from "./components/internal/customer-app-drawer";
const ProfilePage = lazy(() => import("./pages/profile.page"));
const ChangePasswordPage = lazy(() => import("./pages/change-password.page"));
const DetailProductPage = lazy(() => import("./pages/detail-product.page"));
const MainEcommercePage = lazy(() => import("./pages/main-ecommerce.page"));
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
      element: <AdminAppDrawer />,
      path: "/admin",
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
        {
          element: <ProfilePage />,
          path: "profile",
        },
        {
          element: <ChangePasswordPage />,
          path: "change-my-password",
        },
      ],
    },
    {
      element: <CustomerAppDrawer />,
      path: "/",
      children: [
        {
          element: <MainEcommercePage />,
          index: true,
        },
        {
          element: <DetailProductPage />,
          path: "product/:id",
        },
        {
          element: <OrderPage />,
          path: "my-order",
        },
        {
          element: <ProfilePage />,
          path: "profile",
        },
        {
          element: <ChangePasswordPage />,
          path: "change-my-password",
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
