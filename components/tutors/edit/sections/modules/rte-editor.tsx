// components/sections/modules/edit/rte-editor.tsx
"use client";

import { TipTapEditor } from "@/components/tiptap/editor";
import type { RteModule } from "@/lib/tutors/sections/types";

export function RteModuleEditor({
  module,
  updateModule,
}: {
  module: RteModule;
  updateModule: (newModule: RteModule) => void;
}) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 text-sm font-medium text-gray-500">Rich Text Editor</h3>
      <TipTapEditor
        content={module.content.doc}
        onChange={(newDoc) => {
          updateModule({
            ...module,
            content: {
              ...module.content,
              doc: newDoc,
            },
          });
        }}
      />
    </div>
  );
}
