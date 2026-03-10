import { Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">

      <h1 className="text-lg font-semibold text-gray-800">
        Fraud Detection Dashboard
      </h1>

      <div className="flex items-center gap-4">

        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <User className="w-6 h-6 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Admin
          </span>
        </div>

      </div>

    </div>
  );
}