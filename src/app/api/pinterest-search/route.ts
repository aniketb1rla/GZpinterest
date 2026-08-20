import { NextRequest, NextResponse } from "next/server";
import { searchPinterestPins } from "@/lib/pinterest-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, categoryHint, pinterestToken, useSandbox, brandProfile, geminiApiKey } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const pins = await searchPinterestPins(
      query,
      categoryHint,
      pinterestToken,
      useSandbox !== undefined ? useSandbox : true,
      brandProfile,
      geminiApiKey
    );

    return NextResponse.json({
      success: true,
      query,
      pins,
      count: pins.length,
    });
  } catch (error: any) {
    console.error("Error in /api/pinterest-search:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to search Pinterest pins",
      },
      { status: 500 }
    );
  }
}
