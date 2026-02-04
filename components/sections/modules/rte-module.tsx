import type { RteModule } from "@/lib/sections/types";
import { TipTapRenderer } from "@/components/rte/renderer";

type Props = {
  module: RteModule;
  className?: string;
};

export function RteModuleView({ module, className }: Props) {
  return (
    <TipTapRenderer
      content={module.content.doc}
      className={className}
    />
  );
}
