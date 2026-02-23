interface MeterProps {
  label: string;
  value: number | null; // 0–1
  color?: string;
}

export default function EnergyMeter({ label, value, color = "bg-purple-500" }: MeterProps) {
  const pct = value != null ? Math.round(value * 100) : null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm font-medium text-gray-300">
        <span>{label}</span>
        <span>{pct != null ? `${pct}%` : "N/A"}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: pct != null ? `${pct}%` : "0%" }}
          role="progressbar"
          aria-valuenow={pct ?? 0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}
