// components/sections/modules/edit/minicard-editor.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TipTapEditor } from "@/components/rte/editor";
import type { MiniCardModule } from "@/lib/sections/types";

function csvToList(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function listToCsv(a: string[]) {
  return a.join(", ");
}

export function MiniCardModuleEditor({
  module,
  updateModule,
}: {
  module: MiniCardModule;
  updateModule: (newModule: MiniCardModule) => void;
}) {
  const { content } = module;

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 text-sm font-medium text-gray-500">Mini Card</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.title}
            onChange={(e) =>
              updateModule({
                ...module,
                content: { ...content, title: e.target.value },
              })
            }
          />
        </div>

        {content.kind === "tags" && (
          <div className="space-y-2">
            <Label>Items (comma-separated)</Label>
            <Input
              value={listToCsv(content.items)}
              onChange={(e) =>
                updateModule({
                  ...module,
                  content: { ...content, items: csvToList(e.target.value) },
                })
              }
            />
          </div>
        )}

        {content.kind === "value" && (
          <>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                value={content.value}
                onChange={(e) =>
                  updateModule({
                    ...module,
                    content: { ...content, value: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Helper text</Label>
              <Input
                value={content.helper ?? ""}
                onChange={(e) =>
                  updateModule({
                    ...module,
                    content: { ...content, helper: e.target.value },
                  })
                }
              />
            </div>
          </>
        )}

        {content.kind === "rte" && (
          <div className="space-y-2">
            <Label>Content</Label>
            <TipTapEditor
              content={content.doc}
              onChange={(newDoc) => {
                updateModule({
                  ...module,
                  content: {
                    ...content,
                    doc: newDoc,
                  },
                });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
