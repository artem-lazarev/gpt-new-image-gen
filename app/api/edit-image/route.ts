import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { image, prompt, size } = (await req.json()) as {
      image: string; // data URL
      prompt: string;
      size?: "1024x1024" | "1792x1024" | "1024x1792";
    };

    if (!image || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing image or prompt" }),
        { status: 400 }
      );
    }

    // Parse data URL into Blob
    const match = /^data:(.+);base64,(.*)$/.exec(image);
    if (!match) {
      return new Response(
        JSON.stringify({ error: "Invalid image format" }),
        { status: 400 }
      );
    }
    const mediaType = match[1];
    const base64Data = match[2];
    const binary = Buffer.from(base64Data, "base64");
    const blob = new Blob([binary], { type: mediaType });

    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("prompt", prompt);
    form.append("image", blob, `image.${mediaType.split("/")[1] || "png"}`);
    form.append("size", size ?? "1024x1024");

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: missing OPENAI_API_KEY" }),
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI edits error", errText);
      return new Response(
        JSON.stringify({ error: "Failed to process image" }),
        { status: response.status }
      );
    }

    const json = (await response.json()) as {
      data?: Array<{ b64_json?: string; url?: string }>;
    };
    const b64 = json?.data?.[0]?.b64_json;
    if (!b64) {
      return new Response(
        JSON.stringify({ error: "No image returned" }),
        { status: 502 }
      );
    }
    const outDataUrl = `data:image/png;base64,${b64}`;

    return new Response(JSON.stringify({ image: outDataUrl }), {
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


