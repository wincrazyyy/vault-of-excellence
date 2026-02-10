import type { RteModule } from "@/lib/tutors/sections/types";
import { TipTapRenderer } from "@/components/tiptap/renderer";

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
