import type { RouteObject } from "react-router-dom";
import Start from "./pages/Start";
import Login from "./pages/Login";
import BookingsList from "./pages/BookingsList";
import BookingForm from "./pages/BookingForm";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./auth/ProtectedRoute";

import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";

export const appRoutes = [
  { path: "/", element: <Start />, menuLabel: "Start", visible: "all" },

  { path: "/bookings", element: <BookingsList />, menuLabel: "Bokningar", visible: "auth" },
  { path: "/bookings/new", element: <BookingForm />, parent: "/bookings", visible: "auth" },
  { path: "/bookings/:id/edit", element: <BookingForm />, parent: "/bookings", visible: "auth" },

  { path: "/products", element: <ProductList />, menuLabel: "Rätter", visible: "all" },
  { path: "/products/new", element: <ProductForm />, parent: "/products", visible: "auth" },
  { path: "/products/:id/edit", element: <ProductForm />, parent: "/products", visible: "auth" },

  { path: "/login", element: <Login />, menuLabel: "Logga in", visible: "guest" },
  { path: "*", element: <NotFoundPage />, visible: "all" },
];

const routerChildren: RouteObject[] = appRoutes.map((r) => {
  const wrapped =
    r.visible === "auth" ? <ProtectedRoute>{r.element}</ProtectedRoute> : r.element;
  return { path: r.path, element: wrapped };
});

export default routerChildren;
