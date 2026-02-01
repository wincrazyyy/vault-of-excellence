import Image from "next/image";
import type { ImageModule } from "@/lib/sections/types";

type Props = {
  module: ImageModule;
  className?: string;
};

export function ImageModuleView({ module, className }: Props) {
  const { src, alt, caption } = module.content;

  return (
    <figure className={className}>
      <div className="relative w-full overflow-hidden rounded-lg border border-black/10 bg-black/5 aspect-video">
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      {caption ? (
        <figcaption className="mt-2 text-sm text-black/60">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
