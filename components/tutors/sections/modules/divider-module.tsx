import type { DividerModule } from "@/lib/tutors/sections/types";

type Props = {
  module: DividerModule;
  className?: string;
};

export function DividerModuleView({ module, className }: Props) {
  const variant = module.content.variant ?? "line";

  if (variant === "space") {
    return <div className={["h-6", className ?? ""].join(" ")} />;
  }

  return <hr className={["my-6 border-black/10", className ?? ""].join(" ")} />;
}
