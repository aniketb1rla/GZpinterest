import { NextRequest, NextResponse } from "next/server";
import {
  fetchPinterestUserPins,
  createPinterestPin,
  DEFAULT_PINTEREST_TOKEN,
  DEFAULT_PINTEREST_BASE_URL,
} from "@/lib/pinterest-service";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || process.env.PINTEREST_ACCESS_TOKEN || DEFAULT_PINTEREST_TOKEN;
    const baseUrl = url.searchParams.get("baseUrl") || process.env.PINTEREST_API_BASE_URL || DEFAULT_PINTEREST_BASE_URL;

    const pins = await fetchPinterestUserPins(token, baseUrl);
    return NextResponse.json({ success: true, pins, count: pins.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch user pins" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { boardId, title, description, link, imageUrl, accessToken, baseUrl } = body;

    if (!boardId) {
      return NextResponse.json({ error: "boardId is required" }, { status: 400 });
    }
    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }

    const token = accessToken || process.env.PINTEREST_ACCESS_TOKEN || DEFAULT_PINTEREST_TOKEN;
    const apiBase = baseUrl || process.env.PINTEREST_API_BASE_URL || DEFAULT_PINTEREST_BASE_URL;

    const result = await createPinterestPin(
      {
        boardId,
        title: title || "AI Creative Studio Pin",
        description,
        link,
        imageUrl,
      },
      token,
      apiBase
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, pin: result.pin });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to publish pin to Pinterest" },
      { status: 500 }
    );
  }
}
