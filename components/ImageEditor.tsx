"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import PromptInput from "@/components/PromptInput";
import GeneratedImage from "@/components/GeneratedImage";
import { Button } from "@/components/ui/button";

export default function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!uploadedImage || !prompt) return;
    setIsLoading(true);
    setError(null);
    setGenerated(null);
    try {
      const res = await fetch("/api/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedImage, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate image");
      setGenerated(data.image as string);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setPrompt("");
    setGenerated(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 mb-4 tracking-tight">
            IMAGE EDITOR
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Powered by</span>
            <span className="text-green-400 font-semibold">OpenAI</span>
            <span>•</span>
            <span className="text-purple-400 font-semibold">Face Preservation Mode</span>
            <span className="text-yellow-400 text-lg">✨</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <ImageUpload value={uploadedImage} onChange={setUploadedImage} />
          <GeneratedImage image={generated} isLoading={isLoading} />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={handleReset}
              className="w-full max-w-sm bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 border-2 border-gray-300 shadow-lg hover:shadow-xl"
            >
              <span className="mr-2">🔄</span>
              Start Over
            </Button>
          </div>

          <PromptInput value={prompt} onChange={setPrompt} />

          <div>
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !uploadedImage || !prompt}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl hover:from-green-600 hover:to-blue-600 active:from-green-700 active:to-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>Generate Image</span>
                </div>
              )}
            </Button>
          </div>

          {error && (
            <p className="text-center text-red-400 text-sm">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}


