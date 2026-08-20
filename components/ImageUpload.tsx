"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

export interface ImageUploadProps {
  onChange: (base64: string | null) => void;
  value?: string | null;
}

export default function ImageUpload({ onChange, value }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!/(png|jpg|jpeg|webp)$/i.test(file.type)) {
      onChange(null);
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      onChange(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange((reader.result as string) ?? null);
    reader.readAsDataURL(file);
  }, [onChange]);

  return (
    <Card className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
      <div className="bg-black px-4 py-3 flex items-center gap-2">
        <span className="text-xl">📸</span>
        <span className="text-white font-bold text-sm tracking-wide uppercase">Original</span>
      </div>
      <label
        className="block aspect-square bg-gradient-to-br from-pink-300 to-pink-500 p-6 md:p-8 cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {value ? (
          <div className="relative w-full h-full bg-white rounded-xl overflow-hidden shadow-lg">
            <Image src={value} alt="Original" fill unoptimized className="object-cover" />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-700">
              <div className="text-4xl mb-2">📤</div>
              <p className="text-sm font-medium">Drag & drop your image, or click to upload</p>
            </div>
          </div>
        )}
      </label>
    </Card>
  );
}


