"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ImageModule } from "@/lib/tutors/sections/types";
import { ImageUploadEditor } from "@/components/tutors/edit/image-upload-editor";

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
      <h3 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Image Module
      </h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
            <Label>Upload Image</Label>
            <div className="text-xs text-muted-foreground mb-2">
              Tip: For grid layouts, upload an image that roughly matches the shape of your grid cell.
            </div>
            <ImageUploadEditor 
                currentImage={content.src}
                aspectRatio={undefined} 
                onImageUploaded={(url) => handleChange("src", url)}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="img-alt">Alt Text</Label>
            <Input
              id="img-alt"
              placeholder="Simple description for accessibility"
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