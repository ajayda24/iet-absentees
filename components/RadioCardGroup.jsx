import { cn } from "@/lib/utils";
import { CircleCheckBig } from "lucide-react";

export default function RadioCardGroup({ title, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium ">{title}</p>

      <div className="grid grid-cols-4 gap-2">
        {options.map((opt) => {
          const active = value === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "rounded-xl border p-3 text-sm font-medium transition-all flex items-center justify-center gap-2 ",
                active
                  ? "border-green-200 bg-green-100"
                  : "border-border bg-background"
              )}
            >
              {active && <CircleCheckBig className="h-4 w-4 text-green-600" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
