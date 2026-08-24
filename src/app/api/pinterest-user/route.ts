import { NextRequest, NextResponse } from "next/server";
import { fetchPinterestUserProfile, DEFAULT_PINTEREST_TOKEN, DEFAULT_PINTEREST_BASE_URL } from "@/lib/pinterest-service";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token") || process.env.PINTEREST_ACCESS_TOKEN || DEFAULT_PINTEREST_TOKEN;
    const baseUrl = url.searchParams.get("baseUrl") || process.env.PINTEREST_API_BASE_URL || DEFAULT_PINTEREST_BASE_URL;

    const result = await fetchPinterestUserProfile(token, baseUrl);
    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error || "Failed to authenticate Pinterest token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      service: "Pinterest v5 Developer / MCP App",
      endpoint: baseUrl,
      account: result.account,
    });
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, error: error.message || "Failed to reach Pinterest API" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token =
      body.accessToken ||
      body.token ||
      process.env.PINTEREST_ACCESS_TOKEN ||
      DEFAULT_PINTEREST_TOKEN;
    const baseUrl =
      body.baseUrl ||
      process.env.PINTEREST_API_BASE_URL ||
      DEFAULT_PINTEREST_BASE_URL;

    // Verify token against official Pinterest API Sandbox / Prod endpoint
    const result = await fetchPinterestUserProfile(token, baseUrl);

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        service: "Pinterest MCP App (Sandbox/Production)",
        endpoint: baseUrl,
        account: result.account,
      });
    }

    return NextResponse.json({
      valid: false,
      error: result.error || "Invalid Pinterest MCP App Token",
    });
  } catch (error: any) {
    console.error("Pinterest API validation error:", error);
    return NextResponse.json({
      valid: false,
      error: error.message || "Failed to reach Pinterest API",
    });
  }
}
