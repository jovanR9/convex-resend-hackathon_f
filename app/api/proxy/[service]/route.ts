import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { service: string } }
) {
  const { service } = await context.params; // Await params here
  const body = await req.json();
  const appKey = req.headers.get("x-sentinel-key");

  // Basic mock auth check
  if (!appKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  // TEMP: Use your actual Gemini API key here
  const geminiApiKey = process.env.GEMINI_API_KEY || "GEMINI API KEY HERE";

  // Determine service endpoint
  const endpoint =
    service === "gemini"
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
      : null;

  if (!endpoint) {
    return NextResponse.json({ error: "Unsupported service" }, { status: 400 });
  }

  try {
    const thirdPartyRes = await fetch(`${endpoint}?key=${geminiApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await thirdPartyRes.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
