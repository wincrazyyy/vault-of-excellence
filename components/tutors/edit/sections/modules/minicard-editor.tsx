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
import { 
  AlignLeft, 
  AlignCenter, 
  X, 
  Tags, 
  Hash, 
  FileText, 
  CheckCircle2 
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  const cardTypes = [
    {
      id: "tags",
      label: "Tags List",
      desc: "List skills or subjects",
      icon: Tags,
    },
    {
      id: "value",
      label: "Stat / Value",
      desc: "Highlight a metric",
      icon: Hash,
    },
    {
      id: "rte",
      label: "Rich Text",
      desc: "Freeform content",
      icon: FileText,
    },
  ] as const;

  return (
    <div className="rounded-lg border p-4 bg-background/50 w-full min-w-0">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        MiniCard Module
      </h3>

      <div className="mb-5 space-y-2">
        <div className="flex flex-col gap-2">
            {cardTypes.map((type) => {
                const isSelected = content.kind === type.id;
                const Icon = type.icon;
                return (
                    <button
                        key={type.id}
                        onClick={() => handleTypeChange(type.id)}
                        className={cn(
                            "relative flex items-center gap-3 rounded-md border p-2 text-left transition-all hover:bg-muted/50",
                            isSelected 
                                ? "border-violet-600 bg-violet-50/50 ring-1 ring-violet-600 dark:bg-violet-900/10" 
                                : "border-border bg-background"
                        )}
                    >
                        <div className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                            isSelected 
                                ? "border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-900 dark:text-violet-300" 
                                : "border-border bg-muted text-muted-foreground"
                        )}>
                            <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                                {type.label}
                            </div>
                            <div className="text-[10px] text-muted-foreground leading-tight truncate">
                                {type.desc}
                            </div>
                        </div>

                        {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-violet-600 shrink-0" />
                        )}
                    </button>
                )
            })}
        </div>
      </div>

      <div className="space-y-4">
        {/* Settings Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Align</Label>
            <Tabs
              value={content.align || "left"}
              onValueChange={(v: any) =>
                updateModule({
                  ...module,
                  content: { ...content, align: v },
                })
              }
            >
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="left" className="text-xs px-0">
                  <AlignLeft className="h-3.5 w-3.5" />
                </TabsTrigger>
                <TabsTrigger value="center" className="text-xs px-0">
                  <AlignCenter className="h-3.5 w-3.5" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Style</Label>
            <Select
              value={content.variant || "neutral"}
              onValueChange={(v: any) =>
                updateModule({
                  ...module,
                  content: { ...content, variant: v },
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="violet">Accent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Card Title</Label>
          <Input
            value={content.title}
            placeholder="e.g. Rate, Skills"
            className="h-8 text-sm"
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
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  placeholder="Add tag..."
                  className="h-8 text-sm"
                />
                <Button onClick={handleAddTag} size="sm" className="h-8">Add</Button>
              </div>
              
              <div className="flex flex-wrap gap-1.5 mt-2">
                {content.items.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No tags yet.</p>
                )}
                {content.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground border border-secondary-foreground/10"
                  >
                    <span className="truncate max-w-30">{item}</span>
                    <button
                      onClick={() => handleDeleteTag(i)}
                      className="ml-0.5 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Count Text</Label>
              <Input
                value={content.countLabel || ""}
                placeholder="e.g. 'listed'"
                className="h-8 text-sm"
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
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Value</Label>
              <Input
                value={content.value}
                placeholder="$50"
                className="font-bold h-8 text-sm"
                onChange={(e) =>
                  updateModule({
                    ...module,
                    content: { ...content, value: e.target.value },
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Subtext</Label>
              <Input
                value={content.helper || ""}
                placeholder="per hour"
                className="h-8 text-sm"
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
          <div className="space-y-1.5">
            <Label className="text-xs">Content</Label>
            <div className="min-h-30 border rounded-md overflow-hidden bg-background">
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