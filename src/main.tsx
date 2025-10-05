import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "../sass/index.scss";

import App from "./App";
import routes from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes, 
  },
]);

createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
