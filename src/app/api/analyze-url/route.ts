import { NextRequest, NextResponse } from "next/server";
import { scrapeUrlContent } from "@/lib/link-analyzer";
import { analyzeBrandIntelligence } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, geminiApiKey } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "A valid URL is required" }, { status: 400 });
    }

    // 1. Scrape URL content or Play Store listing
    const scrapedData = await scrapeUrlContent(url);

    // 2. Perform AI Brand & Audience intelligence analysis
    const brandProfile = await analyzeBrandIntelligence(scrapedData, geminiApiKey);

    return NextResponse.json({
      success: true,
      brandProfile,
      scrapedData,
    });
  } catch (error: any) {
    console.error("Error in /api/analyze-url:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze URL",
      },
      { status: 500 }
    );
  }
}
