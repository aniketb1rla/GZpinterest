import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token || process.env.PINTEREST_ACCESS_TOKEN;
    const forceSandbox = body.useSandbox !== undefined ? body.useSandbox : true;

    if (!token) {
      return NextResponse.json({
        valid: false,
        error: "No Pinterest Access Token provided",
      });
    }

    // Try endpoints in order (Sandbox first if requested/default, then Production)
    const baseUrls = forceSandbox
      ? ["https://api-sandbox.pinterest.com/v5", "https://api.pinterest.com/v5"]
      : ["https://api.pinterest.com/v5", "https://api-sandbox.pinterest.com/v5"];

    let successData: any = null;
    let activeBaseUrl = baseUrls[0];
    let lastError: string = "";
    let lastStatus: number = 401;

    for (const baseUrl of baseUrls) {
      try {
        const userRes = await fetch(`${baseUrl}/user_account`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(6000),
        });

        if (userRes.ok) {
          successData = await userRes.json();
          activeBaseUrl = baseUrl;
          break;
        } else {
          lastStatus = userRes.status;
          const errText = await userRes.text();
          lastError = `Pinterest (${baseUrl.includes("sandbox") ? "Sandbox" : "Production"}) HTTP ${lastStatus}: ${errText || userRes.statusText}`;
        }
      } catch (e: any) {
        lastError = e.message || "Network timeout connecting to Pinterest";
      }
    }

    if (!successData) {
      return NextResponse.json({
        valid: false,
        status: lastStatus,
        error: lastError,
      });
    }

    const isSandbox = activeBaseUrl.includes("sandbox");

    // Fetch User's Boards
    let boards: any[] = [];
    try {
      const boardsRes = await fetch(`${activeBaseUrl}/boards?page_size=25`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(6000),
      });
      if (boardsRes.ok) {
        const boardsData = await boardsRes.json();
        boards = boardsData.items || [];
      }
    } catch (e) {
      console.warn("Could not fetch user boards:", e);
    }

    // Fetch User's Pins
    let pins: any[] = [];
    try {
      const pinsRes = await fetch(`${activeBaseUrl}/pins?page_size=25`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(6000),
      });
      if (pinsRes.ok) {
        const pinsData = await pinsRes.json();
        pins = pinsData.items || [];
      }
    } catch (e) {
      console.warn("Could not fetch user pins:", e);
    }

    return NextResponse.json({
      valid: true,
      isSandbox,
      environment: isSandbox ? "Pinterest Sandbox" : "Pinterest Production",
      baseUrl: activeBaseUrl,
      user: {
        username: successData.username || successData.business_name || "Pinterest Creator",
        profileImage: successData.profile_image || "",
        accountType: successData.account_type || (isSandbox ? "SANDBOX_ACCOUNT" : "PROD_ACCOUNT"),
        boardCount: boards.length,
        pinCount: pins.length,
      },
      boards: boards.map((b: any) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        pinCount: b.pin_count || 0,
      })),
      pinsCount: pins.length,
    });
  } catch (error: any) {
    console.error("Pinterest validation error:", error);
    return NextResponse.json({
      valid: false,
      error: error.message || "Failed to connect to Pinterest API",
    });
  }
}
