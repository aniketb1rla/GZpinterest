import { NextRequest, NextResponse } from "next/server";
import { generateNanoBananaCampaign } from "@/lib/gemini";
import { BrandProfile, PinterestPin, UploadedAsset } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandProfile, selectedPins, assets, campaignGoal, geminiApiKey } = body;

    if (!brandProfile || !brandProfile.name) {
      return NextResponse.json({ error: "Brand profile is required" }, { status: 400 });
    }

    const { metaAdSets, googleAdSets } = await generateNanoBananaCampaign(
      brandProfile as BrandProfile,
      (selectedPins || []) as PinterestPin[],
      (assets || []) as UploadedAsset[],
      campaignGoal || "Conversions & ROAS",
      geminiApiKey
    );

    return NextResponse.json({
      success: true,
      metaAdSets,
      googleAdSets,
    });
  } catch (error: any) {
    console.error("Error in /api/generate-campaign:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate campaign ad sets",
      },
      { status: 500 }
    );
  }
}
