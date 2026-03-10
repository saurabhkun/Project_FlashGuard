import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";

import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import FraudCheck from "../pages/FraudCheck";
import Analytics from "../pages/Analytics";
import Admin from "../pages/Admin";
import Alerts from "../pages/Alerts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "transactions", element: <Transactions /> },
      { path: "fraud-check", element: <FraudCheck /> },
      { path: "analytics", element: <Analytics /> },
      { path: "alerts", element: <Alerts /> },
      { path: "admin", element: <Admin /> }
    ]
  }
]);