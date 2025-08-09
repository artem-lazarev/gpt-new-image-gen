import { NextRequest } from "next/server";
import { experimental_generateImage as generateImage } from 'ai';
import { openai } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, size } = (await req.json()) as {
      image: string;
      prompt: string;
      size?: "1024x1024" | "1536x1024" | "1024x1536";
    };

    if (!image || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing image or prompt" }),
        { status: 400 }
      );
    }

    const { image: resultImage } = await generateImage({
      model: openai.image("gpt-image-1"),
      prompt,
      image,
      size: size ?? "1024x1024",
      providerOptions: {
        openai: { quality: "high" },
      },
    });

    // The SDK returns a Blob-like object; convert to a data URL for now
    // Consumers may switch to streaming/file storage later
    const arrayBuffer = await resultImage.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = resultImage.type || "image/png";
    const dataUrl = `data:${contentType};base64,${base64}`;

    return new Response(JSON.stringify({ image: dataUrl }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("/api/edit-image error", error);
    return new Response(
      JSON.stringify({ error: "Failed to process image" }),
      { status: 500 }
    );
  }
}


