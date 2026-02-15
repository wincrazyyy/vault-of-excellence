"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TipTapEditor } from "@/components/tiptap/editor";
import type { MiniCardModule } from "@/lib/tutors/sections/types";
import { AlignLeft, AlignCenter, X } from "lucide-react";

interface MiniCardModuleEditorProps {
  module: MiniCardModule;
  updateModule: (newModule: MiniCardModule) => void;
}

export function MiniCardModuleEditor({
  module,
  updateModule,
}: MiniCardModuleEditorProps) {
  const { content } = module;
  const [tagInput, setTagInput] = useState("");

  const handleTypeChange = (newKind: "tags" | "value" | "rte") => {
    const base = {
      title: content.title,
      variant: content.variant,
      align: content.align,
    };

    let newContent: any = { ...base, kind: newKind };

    if (newKind === "tags") {
      newContent = { ...newContent, items: [], countLabel: "items" };
    } else if (newKind === "value") {
      newContent = { ...newContent, value: "100%", helper: "Description" };
    } else if (newKind === "rte") {
      newContent = {
        ...newContent,
        doc: { type: "doc", content: [{ type: "paragraph" }] },
      };
    }

    updateModule({ ...module, content: newContent });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && content.kind === "tags") {
      updateModule({
        ...module,
        content: {
          ...content,
          items: [...content.items, tagInput.trim()],
        },
      });
      setTagInput("");
    }
  };

  const handleDeleteTag = (index: number) => {
    if (content.kind === "tags") {
      const newItems = content.items.filter((_, i) => i !== index);
      updateModule({
        ...module,
        content: { ...content, items: newItems },
      });
    }
  };

  return (
    <div className="rounded-lg border p-4 bg-background">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          MiniCard Settings
        </h3>

        <Select
          value={content.kind}
          onValueChange={(val: any) => handleTypeChange(val)}
        >
          <SelectTrigger className="w-35 h-8 text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tags">Tags List</SelectItem>
            <SelectItem value="value">Stat / Value</SelectItem>
            <SelectItem value="rte">Rich Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Alignment</Label>
            <Tabs
              value={content.align || "left"}
              onValueChange={(v: any) =>
                updateModule({
                  ...module,
                  content: { ...content, align: v },
                })
              }
            >
              <TabsList className="grid w-full grid-cols-2 h-9">
                <TabsTrigger value="left">
                  <AlignLeft className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="center">
                  <AlignCenter className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Color Style</Label>
            <Select
              value={content.variant || "neutral"}
              onValueChange={(v: any) =>
                updateModule({
                  ...module,
                  content: { ...content, variant: v },
                })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral (Gray)</SelectItem>
                <SelectItem value="violet">Accent (Violet)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Card Title</Label>
          <Input
            value={content.title}
            placeholder="e.g. Subjects, Hourly Rate, Bio"
            onChange={(e) =>
              updateModule({
                ...module,
                content: { ...content, title: e.target.value },
              })
            }
          />
        </div>

        <hr className="border-dashed" />

        {content.kind === "tags" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Type a tag and press Enter"
                />
                <Button onClick={handleAddTag} size="sm">Add</Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {content.items.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No tags added yet.</p>
                )}
                {content.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {item}
                    <button
                      onClick={() => handleDeleteTag(i)}
                      className="ml-1 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Count Label (Optional)</Label>
              <Input
                value={content.countLabel || ""}
                placeholder="e.g. 'subjects listed'"
                onChange={(e) =>
                  updateModule({
                    ...module,
                    content: { ...content, countLabel: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}

        {content.kind === "value" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Main Value</Label>
              <Input
                value={content.value}
                placeholder="e.g. $50/hr or 100%"
                className="font-bold"
                onChange={(e) =>
                  updateModule({
                    ...module,
                    content: { ...content, value: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Helper / Subtext</Label>
              <Input
                value={content.helper || ""}
                placeholder="e.g. per session"
                onChange={(e) =>
                  updateModule({
                    ...module,
                    content: { ...content, helper: e.target.value },
                  })
                }
              />
            </div>
          </div>
        )}

        {content.kind === "rte" && (
          <div className="space-y-2">
            <Label>Rich Text Content</Label>
            <div className="min-h-37.5 border rounded-md">
              <TipTapEditor
                content={content.doc}
                onChange={(newDoc) =>
                  updateModule({
                    ...module,
                    content: { ...content, doc: newDoc },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}