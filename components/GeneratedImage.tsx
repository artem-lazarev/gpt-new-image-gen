"use client";

import { Card } from "@/components/ui/card";

export interface GeneratedImageProps {
  image?: string | null;
  isLoading?: boolean;
}

export default function GeneratedImage({ image, isLoading }: GeneratedImageProps) {
  return (
    <Card className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
      <div className="bg-black px-4 py-3 flex items-center gap-2">
        <span className="text-xl">🎨</span>
        <span className="text-white font-bold text-sm tracking-wide uppercase">Preview</span>
      </div>
      <div className="aspect-square bg-gradient-to-br from-blue-300 to-blue-500 p-6 md:p-8 flex items-center justify-center">
        {image ? (
          <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-lg">
            <img src={image} alt="Generated" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="text-center text-gray-700">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                <p className="text-sm font-medium">Processing...</p>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-2">🎨</div>
                <p className="text-sm font-medium">AI-edited image will appear here</p>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}


