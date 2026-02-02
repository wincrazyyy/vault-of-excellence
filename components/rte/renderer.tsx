import StarterKit from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { JSONContent } from "@tiptap/core";
import { cn } from "@/lib/utils";

export function TipTapRenderer({
  content,
  className,
}: {
  content: JSONContent;
  className?: string;
}) {
  const node = renderToReactElement({
    extensions: [StarterKit],
    content,
  });

  return (
    <div
      className={cn(
        // Base typography
        "prose prose-sm max-w-none leading-6 text-foreground",

        // Remove top/bottom margin from first/last child
        "*:first:mt-0",
        "*:last:mb-0",

        // Tighten spacing overall
        "prose-p:my-2",
        "prose-h1:mt-5 prose-h1:mb-2",
        "prose-h2:mt-5 prose-h2:mb-2",
        "prose-h3:mt-4 prose-h3:mb-2",

        // Lists
        "prose-ul:my-2 prose-ul:pl-5",
        "prose-ol:my-2 prose-ol:pl-5",
        "prose-li:my-0",
        "[&_li>p]:my-0",

        className,
      )}
    >
      {node}
    </div>
  );
}
