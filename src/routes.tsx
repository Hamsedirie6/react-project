import type { RouteObject } from "react-router-dom";

import Start from "./pages/Start";
import Login from "./pages/Login";
import BookingsList from "./pages/BookingsList";
import BookingForm from "./pages/Bookingform"; // stava som din fil heter
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./auth/ProtectedRoute";

export const appRoutes = [
  { path: "/", element: <Start />, menuLabel: "Start", visible: "all" },

  // Bokningar (endast inloggade)
  { path: "/bookings", element: <BookingsList />, menuLabel: "Bokningar", visible: "auth" },
  { path: "/bookings/new", element: <BookingForm />, parent: "/bookings", visible: "auth" },
  // ✅ Den här saknades: edit-läge
  { path: "/bookings/:id/edit", element: <BookingForm />, parent: "/bookings", visible: "auth" },

  // Login (bara gäster)
  { path: "/login", element: <Login />, menuLabel: "Logga in", visible: "guest" },

  // 404
  { path: "*", element: <NotFoundPage />, visible: "all" },
];

const routerChildren: RouteObject[] = appRoutes.map((r) => {
  const wrapped =
    r.visible === "auth" ? <ProtectedRoute>{r.element}</ProtectedRoute> : r.element;

  return { path: r.path, element: wrapped };
});

export default routerChildren;
