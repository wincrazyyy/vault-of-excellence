"use client";

import { useState, useCallback, useId } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedImg } from "@/lib/image-utils";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Image as ImageIcon, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadEditorProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  aspectRatio?: number;
}

export function ImageUploadEditor({
  currentImage,
  onImageUploaded,
  aspectRatio = 1,
}: ImageUploadEditorProps) {
  const uniqueId = useId(); 

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
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

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
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
               <div className={cn(
                 "relative overflow-hidden border border-border bg-muted shadow-sm",
                 aspectRatio === 1 ? "h-24 w-24 rounded-full" : "h-24 w-40 rounded-lg"
               )}>
                 <img 
                    src={currentImage} 
                    alt="Preview" 
                    className="h-full w-full object-cover" 
                 />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Pencil className="h-6 w-6 text-white drop-shadow-md" />
                 </div>
               </div>
            ) : (
              <div className={cn(
                "flex items-center justify-center border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors",
                aspectRatio === 1 ? "h-24 w-24 rounded-full" : "h-24 w-40 rounded-lg"
              )}>
                <div className="flex flex-col items-center gap-1 p-2">
                   <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            )}
          </label>
        </div>

        <div className="text-center space-y-1">
            <Button variant="ghost" size="sm" className="h-auto py-1 px-3 text-xs" asChild>
                <label htmlFor={`image-upload-${uniqueId}`} className="cursor-pointer">
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

          <div className="relative h-100 w-full bg-slate-900 rounded-md overflow-hidden">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="py-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(val) => setZoom(val[0])}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUploading}>
              {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}