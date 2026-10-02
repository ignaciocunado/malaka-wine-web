import type { ReactNode } from "react";

import { ExclamationIcon } from "./icons";
import { cn } from "./cn";

export function Alert({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "info" }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl px-4 py-3 text-subheadline",
        tone === "error" ? "bg-system-red/10 text-system-red" : "bg-system-blue/10 text-system-blue",
      )}
    >
      <ExclamationIcon className="mt-0.5 size-4.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
