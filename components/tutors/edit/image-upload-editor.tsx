"use client";

import { useState, useRef, useId } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { getCroppedImg } from "@/lib/image-utils";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Upload, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadEditorProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  aspectRatio?: number;
  lockAspectRatio?: boolean;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageUploadEditor({
  currentImage,
  onImageUploaded,
  aspectRatio = 16 / 9,
  lockAspectRatio = false,
}: ImageUploadEditorProps) {
  const uniqueId = useId();
  const imgRef = useRef<HTMLImageElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result?.toString() || "");
        setIsOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (lockAspectRatio) {
      setCrop(centerAspectCrop(width, height, aspectRatio));
    } else {
      setCrop(
        centerCrop(
            makeAspectCrop(
                { unit: '%', width: 90 },
                16/9,
                width,
                height
            ),
            width,
            height
      ));
    }
  };

  const handleSave = async () => {
    if (!imageSrc || !completedCrop || !imgRef.current) return;

    setIsUploading(true);
    try {
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const scaledCrop = {
        ...completedCrop,
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY,
      };

      const croppedBlob = await getCroppedImg(
        imageSrc,
        scaledCrop,
        "upload.jpg"
      );

      const supabase = createClient();
      const fileName = `${uuidv4()}.jpg`;

      const { error } = await supabase.storage
        .from("tutors")
        .upload(fileName, croppedBlob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from("tutors")
        .getPublicUrl(fileName);

      onImageUploaded(publicUrl);
      setIsOpen(false);
    } catch (e) {
      console.error(e);
      alert("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id={`image-upload-${uniqueId}`}
            onChange={onFileChange}
          />
          <label
            htmlFor={`image-upload-${uniqueId}`}
            className="cursor-pointer block relative transition-all active:scale-95"
          >
            {currentImage ? (
              <div
                className={cn(
                  "relative overflow-hidden border border-border bg-muted shadow-sm",
                  aspectRatio === 1 
                    ? "h-32 w-32 rounded-full" 
                    : "w-48 h-auto rounded-lg"
                )}
              >
                <img
                  src={currentImage}
                  alt="Preview"
                  className={cn(
                    "block w-full",
                    aspectRatio === 1 ? "h-full object-cover" : "h-auto object-contain"
                  )}
                />
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pencil className="h-6 w-6 text-white drop-shadow-md" />
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors",
                  aspectRatio === 1 ? "h-32 w-32 rounded-full" : "h-32 w-48 rounded-lg"
                )}
              >
                <div className="flex flex-col items-center gap-1 p-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            )}
          </label>
        </div>

        <div className="text-center space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto py-1 px-3 text-xs"
            asChild
          >
            <label
              htmlFor={`image-upload-${uniqueId}`}
              className="cursor-pointer"
            >
              {currentImage ? "Change Image" : "Upload Image"}
            </label>
          </Button>
          <p className="text-[10px] text-muted-foreground max-w-37.5 leading-tight mx-auto">
            JPG or PNG. Max 5MB.
          </p>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>

          <div className="relative flex justify-center bg-slate-900 rounded-md overflow-hidden p-4">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={lockAspectRatio ? aspectRatio : undefined}
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imageSrc}
                  onLoad={onImageLoad}
                  style={{ maxHeight: "60vh", objectFit: "contain" }}
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter className="sm:justify-between items-center">
            <div className="text-xs text-muted-foreground hidden sm:block">
                {lockAspectRatio 
                    ? "Aspect ratio is locked for this image." 
                    : "Drag the corners to change shape."}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
                </Button>
                <Button onClick={handleSave} disabled={isUploading}>
                {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Image
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}