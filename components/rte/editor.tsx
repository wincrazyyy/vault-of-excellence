"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { JSONContent } from "@tiptap/core";

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

    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
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
      <EditorContent editor={editor} />
    </div>
  );
}
