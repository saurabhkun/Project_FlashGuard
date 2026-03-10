import { Shield, AlertTriangle, TrendingUp, Activity } from "lucide-react";

const icons = {
  shield: Shield,
  alert: AlertTriangle,
  trending: TrendingUp,
  activity: Activity,
};

export function StatsCard({ title, value, change, icon, trend }) {
  const Icon = icons[icon];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      
      <div className="flex items-center justify-between mb-4">

        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>

        {change && (
          <span
            className={`text-sm font-medium ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
          >
            {change}
          </span>
        )}

      </div>

      <h3 className="text-gray-600 text-sm font-medium mb-1">
        {title}
      </h3>

      <p className="text-3xl font-bold text-gray-900">
        {value}
      </p>

    </div>
  );
}