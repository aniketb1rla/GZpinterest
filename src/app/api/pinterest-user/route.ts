import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token || process.env.PINTEREST_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json({
        valid: false,
        error: "No Pinterest Access Token provided",
      });
    }

    // 1. Fetch User Account Profile from Pinterest v5 API
    const userRes = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      return NextResponse.json({
        valid: false,
        status: userRes.status,
        error: `Pinterest API Error (${userRes.status}): ${errText || userRes.statusText}`,
      });
    }

    const userData = await userRes.json();

    // 2. Fetch User's Boards
    let boards: any[] = [];
    try {
      const boardsRes = await fetch("https://api.pinterest.com/v5/boards?page_size=20", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (boardsRes.ok) {
        const boardsData = await boardsRes.json();
        boards = boardsData.items || [];
      }
    } catch (e) {
      console.warn("Could not fetch user boards:", e);
    }

    // 3. Fetch User's Pins
    let pins: any[] = [];
    try {
      const pinsRes = await fetch("https://api.pinterest.com/v5/pins?page_size=25", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(8000),
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
      user: {
        username: userData.username || userData.business_name || "Pinterest Creator",
        profileImage: userData.profile_image || "",
        accountType: userData.account_type || "USER",
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
