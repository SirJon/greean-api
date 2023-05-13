import { createBrowserRouter } from "react-router-dom";

import Index from "./index";
import Login from "./auth/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Login />,
  },
]);

export default router;