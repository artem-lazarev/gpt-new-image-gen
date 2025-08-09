"use client";

import { Textarea } from "@/components/ui/textarea";

export interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function PromptInput({ value, onChange, maxLength = 500 }: PromptInputProps) {
  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder="💭 Describe your edit..."
        className="w-full bg-gray-900 border-2 border-gray-700 rounded-2xl
                   px-6 py-4 text-white placeholder-gray-400
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                   hover:border-gray-600 transition-all duration-200
                   resize-none min-h-[120px] text-base leading-relaxed
                   shadow-inner"
      />
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 pointer-events-none">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}


