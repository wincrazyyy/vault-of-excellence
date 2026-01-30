import StarterKit from "@tiptap/starter-kit";
import { renderToReactElement } from "@tiptap/static-renderer/pm/react";
import type { JSONContent } from "@tiptap/core";

export function TipTapRenderer({ content }: { content: JSONContent }) {
  const node = renderToReactElement({
    extensions: [StarterKit],
    content: content,
  });

  return <div className="prose">{node}</div>;
}
