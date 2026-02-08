import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense>
      <SimpleEditor />
    </Suspense>
  )
}
