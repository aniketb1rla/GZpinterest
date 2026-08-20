import { NextRequest, NextResponse } from "next/server";

const DEFAULT_KEY = "ok_63e7e9468267146a98115657d1e9aa6b";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiKey = body.scraperKey || process.env.PINTEREST_SCRAPER_API_KEY || DEFAULT_KEY;

    // Verify key against omkar scraper search endpoint
    const res = await fetch("https://pinterest-scraper.omkar.cloud/pinterest/search?search_term=aesthetic", {
      headers: {
        "API-Key": apiKey,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        valid: false,
        status: res.status,
        error: `Pinterest Search API Error (${res.status}): ${errText || res.statusText}`,
      });
    }

    const data = await res.json();
    const profilesCount = data.profiles?.length || 0;

    return NextResponse.json({
      valid: true,
      service: "Pinterest Scraper Cloud API",
      endpoint: "https://pinterest-scraper.omkar.cloud",
      profilesFound: profilesCount,
    });
  } catch (error: any) {
    console.error("Pinterest API validation error:", error);
    return NextResponse.json({
      valid: false,
      error: error.message || "Failed to reach Pinterest Scraper API",
    });
  }
}
