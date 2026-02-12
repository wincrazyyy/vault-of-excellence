"use client";

import { useState, useCallback } from "react";
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
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";

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
        "avatar.jpg"
      );

      const supabase = createClient();
      const fileName = `${uuidv4()}.jpg`;

      const { data, error } = await supabase.storage
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
      <div className="flex items-center gap-4">
        {currentImage ? (
           <div className="relative h-20 w-20 rounded-full overflow-hidden border border-border">
             <img src={currentImage} alt="Profile" className="h-full w-full object-cover" />
           </div>
        ) : (
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border border-border">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={onFileChange}
          />
          <Button variant="outline" asChild>
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </label>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
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