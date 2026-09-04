import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Kpi({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "profit" | "loss" | "default";
}) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p
        className={cn(
          "mt-1 font-mono text-lg font-semibold tabular-nums sm:text-xl",
          tone === "profit" && "text-green-600",
          tone === "loss" && "text-red-600",
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </Card>
  );
}