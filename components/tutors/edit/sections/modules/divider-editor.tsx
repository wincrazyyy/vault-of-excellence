"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DividerModule } from "@/lib/tutors/sections/types";

interface DividerModuleEditorProps {
  module: DividerModule;
  updateModule: (newModule: DividerModule) => void;
}

export function DividerModuleEditor({
  module,
  updateModule,
}: DividerModuleEditorProps) {
  const { content } = module;

  const handleVariantChange = (value: string) => {
    updateModule({
      ...module,
      content: {
        ...content,
        variant: value as "line" | "space",
      },
    });
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Divider
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="divider-variant">Visual Style</Label>
          <Select
            value={content.variant || "line"}
            onValueChange={handleVariantChange}
          >
            <SelectTrigger id="divider-variant" className="w-full">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Solid Line</SelectItem>
              <SelectItem value="space">Vertical Space Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Visual Preview */}
        <div className="mt-2 flex items-center justify-center rounded border border-dashed p-4 bg-muted/30">
          {content.variant === "line" ? (
            <hr className="w-full border-t border-gray-300" />
          ) : (
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Spacing Gap
            </span>
          )}
        </div>
      </div>
    </div>
  );
}