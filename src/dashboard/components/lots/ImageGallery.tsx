import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";

export default function ImageGallery({
  images,
  onAddPhoto,
}: {
  images: string[];
  onAddPhoto: (dataUrl: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreview(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onAddPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="text-[12px] font-bold text-[#111111]">Images ({images.length})</p>
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <button
            key={`${src.slice(0, 40)}-${i}`}
            type="button"
            onClick={() => setPreview(src)}
            aria-label={`Preview image ${i + 1}`}
            className="overflow-hidden rounded-lg ring-1 ring-[#E1E5E1] transition-transform duration-200 hover:scale-[1.03] hover:ring-[#2E7D32]/50 focus-visible:ring-2"
          >
            <img src={src} alt="" loading="lazy" className="h-[68px] w-full object-cover" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-[68px] flex-col items-center justify-center gap-1 rounded-lg border-[1.5px] border-dashed border-[#C9D2C9] bg-[#FAFBFA] text-[#2E7D32] transition-colors hover:border-[#2E7D32]/60 hover:bg-[#EAF6EA]/50"
        >
          <Plus className="h-4 w-4" strokeWidth={2.4} />
          <span className="text-[10px] font-semibold">Add Photo</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="Add photo"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {/* Lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setPreview(null)}
        >
          <button
            type="button"
            aria-label="Close preview"
            className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={preview}
            alt="Lot photo preview"
            className="max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
