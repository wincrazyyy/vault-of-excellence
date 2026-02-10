"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ImageModule } from "@/lib/tutors/sections/types";
import { ImageIcon } from "lucide-react";

interface ImageModuleEditorProps {
  module: ImageModule;
  updateModule: (newModule: ImageModule) => void;
}

export function ImageModuleEditor({
  module,
  updateModule,
}: ImageModuleEditorProps) {
  const { content } = module;

  const handleChange = (key: keyof typeof content, value: string) => {
    updateModule({
      ...module,
      content: {
        ...content,
        [key]: value,
      },
    });
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 text-sm font-medium text-gray-500">Image</h3>
      
      <div className="space-y-4">
        {/* Preview Area */}
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-dashed bg-muted/30">
          {content.src ? (
            <img 
              src={content.src} 
              alt={content.alt || "Preview"} 
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400?text=Invalid+URL";
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8 opacity-20" />
              <span className="text-xs uppercase tracking-wider">No Image Selected</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="img-src">Image URL</Label>
          <Input
            id="img-src"
            placeholder="https://example.com/image.jpg"
            value={content.src}
            onChange={(e) => handleChange("src", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="img-alt">Alt Text</Label>
            <Input
              id="img-alt"
              placeholder="Description for SEO"
              value={content.alt || ""}
              onChange={(e) => handleChange("alt", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="img-caption">Caption</Label>
            <Input
              id="img-caption"
              placeholder="Visible caption text"
              value={content.caption || ""}
              onChange={(e) => handleChange("caption", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}