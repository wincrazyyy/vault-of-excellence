import Image from "next/image";

export function PromoBanner() {
  return (
    <div className="mt-12 relative w-full aspect-21/9 sm:aspect-3/1 overflow-hidden rounded-2xl shadow-sm border border-border">
      <Image 
        src="/banner-image.jpg" 
        alt="Promotional Banner" 
        fill 
        className="object-cover" 
        priority
      />
    </div>
  );
}