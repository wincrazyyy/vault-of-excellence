import type { CalloutModule } from "@/lib/sections/types";
import { TipTapRenderer } from "@/components/rte/renderer";

type Props = {
  module: CalloutModule;
  className?: string;
};

const toneStyles: Record<CalloutModule["content"]["tone"], string> = {
  info: "border-sky-500/40 bg-sky-500/5",
  success: "border-emerald-500/40 bg-emerald-500/5",
  warning: "border-amber-500/40 bg-amber-500/5",
  danger: "border-rose-500/40 bg-rose-500/5",
};

export function CalloutModuleView({ module, className }: Props) {
  const { tone, title, doc } = module.content;

  return (
    <div
      className={[
        "rounded-lg border-l-4 p-4",
        "border border-black/10",
        toneStyles[tone],
        className ?? "",
      ].join(" ")}
    >
      {title ? <div className="mb-2 font-semibold">{title}</div> : null}

      {doc ? (
        <TipTapRenderer
          content={doc}
        />
      ) : null}
    </div>
  );
}
