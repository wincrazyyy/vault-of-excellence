import Image from "next/image";
import type { ImageModule } from "@/lib/tutors/sections/types";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";

type Props = {
  module: ImageModule;
  className?: string;
};

export function ImageModuleView({ module, className }: Props) {
  const { src, alt, caption } = module.content;

  return (
    <figure className={cn("flex h-full w-full flex-col", className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
        {src ? (
          <Image
            src={src}
            alt={alt ?? "Profile image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <ImageIcon className="h-8 w-8 opacity-50" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">
              No Image Uploaded
            </span>
          </div>
        )}

      </div>

      {caption ? (
        <figcaption className="mt-2 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}