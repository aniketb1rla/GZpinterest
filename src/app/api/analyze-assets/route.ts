import { NextRequest, NextResponse } from "next/server";
import { analyzeAssetsWithVision } from "@/lib/gemini";
import { UploadedAsset } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { assets, geminiApiKey } = body;

    if (!assets || !Array.isArray(assets)) {
      return NextResponse.json({ error: "Assets array is required" }, { status: 400 });
    }

    const analyzedAssets = await analyzeAssetsWithVision(assets as UploadedAsset[], geminiApiKey);

    return NextResponse.json({
      success: true,
      analyzedAssets,
    });
  } catch (error: any) {
    console.error("Error in /api/analyze-assets:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze assets",
      },
      { status: 500 }
    );
  }
}
