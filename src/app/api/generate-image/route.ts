import { NextRequest, NextResponse } from "next/server";
import { generateAdImageFromPrompt } from "@/lib/image-generator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, aspectRatio, negativePrompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const imageUrl = await generateAdImageFromPrompt(prompt, aspectRatio || "1:1", negativePrompt);

    return NextResponse.json({
      success: true,
      imageUrl,
    });
  } catch (error: any) {
    console.error("Error in /api/generate-image:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate image",
      },
      { status: 500 }
    );
  }
}
