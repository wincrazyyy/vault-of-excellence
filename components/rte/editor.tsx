"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";
import { MenuBar } from "./menu-bar";
import { cn } from "@/lib/utils";

// reminder change to simple editor later
type TipTapEditorProps = {
  content?: JSONContent | null;
  onChange?: (json: JSONContent) => void;
  className?: string;
};

export function TipTapEditor({ content, onChange, className }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange?.(editor.getJSON()),
  });

  useEffect(() => {
    if (!editor) return;
    if (content == null) return;

    const current = editor.getJSON();
    const same = JSON.stringify(current) === JSON.stringify(content);
    if (!same) editor.commands.setContent(content, { emitUpdate: false });
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className={className}>
      <MenuBar editor={editor} />

      <div
        className={cn(
          "w-full rounded-md border border-input bg-transparent shadow-sm transition-colors",
          "px-3 py-2 text-base md:text-sm",
          "focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <EditorContent
          editor={editor}
          className={cn(
            // ProseMirror root
            "[&_.ProseMirror]:min-h-9 [&_.ProseMirror]:outline-none",
            "[&_.ProseMirror]:leading-6",

            // Fix odd top/bottom gaps inside the editor content
            "[&_.ProseMirror>_:first-child]:mt-0",
            "[&_.ProseMirror>_:last-child]:mb-0",

            // Typography like renderer (tight)
            "prose prose-sm max-w-none text-foreground",
            "prose-p:my-2",
            "prose-h1:text-2xl prose-h1:font-semibold prose-h1:mt-5 prose-h1:mb-2",
            "prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-5 prose-h2:mb-2",
            "prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2",

            // Lists (tight + consistent)
            "prose-ul:my-2 prose-ul:pl-5 prose-ul:list-disc",
            "prose-ol:my-2 prose-ol:pl-5 prose-ol:list-decimal",
            "prose-li:my-0",
            "[&_li>p]:my-0",

            // Code / block stuff
            "prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:bg-black/5",
            "prose-pre:bg-black/5 prose-pre:rounded-lg prose-pre:p-3",
            "prose-blockquote:border-l-4 prose-blockquote:border-black/10 prose-blockquote:pl-4 prose-blockquote:text-black/70",
            "prose-hr:my-6",
          )}
        />
      </div>
    </div>
  );
}
