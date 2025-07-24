
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CartPage from "./pages/Cart";
import OrderPage from "./pages/Orders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },{
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <OrderPage />,
      },
      {
        path: "*",
        element: <Error />,
      },
    ],
  },
]);

export default router;