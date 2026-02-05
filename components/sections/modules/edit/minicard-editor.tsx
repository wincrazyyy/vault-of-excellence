"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TipTapEditor } from "@/components/rte/editor";
import type { MiniCardModule } from "@/lib/sections/types";

export function MiniCardModuleEditor({
  module,
  updateModule,
}: {
  module: MiniCardModule;
  updateModule: (newModule: MiniCardModule) => void;
}) {
  const { content } = module;
  const [newItem, setNewItem] = useState("");

  function handleAddItem() {
    if (newItem.trim() && content.kind === "tags") {
      const newItems = [...content.items, newItem.trim()];
      updateModule({
        ...module,
        content: {
          ...content,
          items: newItems,
        },
      });
      setNewItem("");
    }
  }

  function handleDeleteItem(index: number) {
    if (content.kind === "tags") {
      const newItems = content.items.filter((_, i) => i !== index);
      updateModule({
        ...module,
        content: {
          ...content,
          items: newItems,
        },
      });
    }
  }

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
            <Label>Items</Label>
            <div className="space-y-2">
              {content.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={item} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="New item"
              />
              <Button onClick={handleAddItem}>Add</Button>
            </div>
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
