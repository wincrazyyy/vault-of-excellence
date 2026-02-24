import Image from "next/image";
import type { ImageModule } from "@/lib/tutors/sections/types";
import { cn } from "@/lib/utils";

type Props = {
  module: ImageModule;
  className?: string;
};

export function ImageModuleView({ module, className }: Props) {
  const { src, alt, caption } = module.content;

  return (
    <figure className={cn("flex h-full w-full flex-col", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      {caption ? (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
