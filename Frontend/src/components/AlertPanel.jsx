import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react";

export function AlertPanel({ alerts }) {

  const getAlertIcon = (severity) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-5 h-5" />;
      case "medium":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200 text-red-800";
      case "medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {alerts && alerts.map((alert) => (
        <div
          key={alert.id}
          className={`border rounded-lg p-4 ${getAlertColor(alert.severity)}`}
        >
          <div className="flex items-start space-x-3">

            <div className="flex-shrink-0 mt-1">
              {getAlertIcon(alert.severity)}
            </div>

            <div className="flex-1">

              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{alert.title}</h4>
                <span className="text-xs uppercase font-medium">
                  {alert.severity}
                </span>
              </div>

              <p className="text-sm mb-3">{alert.description}</p>

              <div className="flex justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimestamp(alert.timestamp)}</span>
                </div>

                <span className="font-medium">
                  Action: {alert.action}
                </span>
              </div>

            </div>

          </div>
        </div>
      ))}
    </div>
  );
}