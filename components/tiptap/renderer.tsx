"use client"

import { useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import type { JSONContent } from "@tiptap/core"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Highlight } from "@tiptap/extension-highlight"

// --- Tiptap Node Styles ---
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Global Editor Styles ---
import "./custom.scss"

// --- Lib ---
import { cn } from "@/lib/utils"

type TipTapRendererProps = {
  content?: JSONContent | null
  className?: string
}

export function TipTapRenderer({ content, className }: TipTapRendererProps) {
  const editor = useEditor({
    editable: false,
    immediatelyRender: false,
    content: content ?? "",
    editorProps: {
      attributes: {
        class: "simple-editor focus:outline-none", 
      },
      handleDOMEvents: {
        mousedown: (view, event) => {
          event.preventDefault()
          return false
        }
      }
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: true,
        },
      }),
      Highlight.configure({ multicolor: true }),
    ],
  })

  useEffect(() => {
    if (!editor) return
    if (content == null) return

    const current = editor.getJSON()
    const same = JSON.stringify(current) === JSON.stringify(content)
    
    if (!same) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [editor, content])

  if (!editor) return null

  return (
    <EditorContent
      editor={editor}
      role="article"
      className={cn("simple-editor-content w-full", className)}
    />
  )
}