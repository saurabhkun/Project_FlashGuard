export function FraudGauge({ value, size = 200 }) {

  const radius = size / 2 - 20;
  const circumference = radius * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  let color = "#10b981";
  let riskLabel = "Low Risk";

  if (value >= 70) {
    color = "#ef4444";
    riskLabel = "High Risk";
  } else if (value >= 40) {
    color = "#f59e0b";
    riskLabel = "Medium Risk";
  }

  return (
    <div className="flex flex-col items-center">

      <div className="relative" style={{ width: size, height: size }}>

        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
        >

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-200"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <span className="text-4xl font-bold">
            {value}%
          </span>

          <span className="text-sm mt-1">
            {riskLabel}
          </span>

        </div>

      </div>

    </div>
  );
}