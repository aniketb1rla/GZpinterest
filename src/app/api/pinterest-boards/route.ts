import { NextRequest, NextResponse } from "next/server";
import {
  fetchPinterestBoards,
  createPinterestBoard,
  DEFAULT_PINTEREST_TOKEN,
  DEFAULT_PINTEREST_BASE_URL,
} from "@/lib/pinterest-service";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || process.env.PINTEREST_ACCESS_TOKEN || DEFAULT_PINTEREST_TOKEN;
    const baseUrl = url.searchParams.get("baseUrl") || process.env.PINTEREST_API_BASE_URL || DEFAULT_PINTEREST_BASE_URL;

    const boards = await fetchPinterestBoards(token, baseUrl);
    return NextResponse.json({ success: true, boards, count: boards.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch boards" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, accessToken, baseUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Board name is required" }, { status: 400 });
    }

    const token = accessToken || process.env.PINTEREST_ACCESS_TOKEN || DEFAULT_PINTEREST_TOKEN;
    const apiBase = baseUrl || process.env.PINTEREST_API_BASE_URL || DEFAULT_PINTEREST_BASE_URL;

    const result = await createPinterestBoard(name, description, token, apiBase);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, board: result.board });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create board" },
      { status: 500 }
    );
  }
}
