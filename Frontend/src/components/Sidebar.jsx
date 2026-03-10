import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CreditCard,
  ShieldAlert,
  BarChart3,
  Settings
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">FraudGuard</h2>

      <nav className="space-y-4">

        <NavLink
          to="/"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-800"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-800"
        >
          <CreditCard size={20} />
          Transactions
        </NavLink>

        <NavLink
          to="/fraud-check"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-800"
        >
          <ShieldAlert size={20} />
          Fraud Check
        </NavLink>

        <NavLink
          to="/analytics"
          className="flex items-center gap-3 p-2 rounded hover:bg-gray-800"
        >
          <BarChart3 size={20} />
          Analytics
        </NavLink>

        
<NavLink
  to="/admin"
  className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
>
  <Settings size={18} />
  <span>Admin</span>
</NavLink>

      </nav>
    </div>
  );
}