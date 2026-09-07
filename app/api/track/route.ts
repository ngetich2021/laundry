import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function detectDeviceType(userAgent: string | null) {
  if (!userAgent) return "unknown";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet/.test(ua)) return "tablet";
  if (/mobile|iphone|android/.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const userAgent = req.headers.get("user-agent");

    await prisma.siteVisit.create({
      data: {
        path: typeof body.path === "string" ? body.path : "/",
        referrer: body.referrer || null,
        utmSource: body.utmSource || null,
        utmMedium: body.utmMedium || null,
        utmCampaign: body.utmCampaign || null,
        ipHash: createHash("sha256").update(ip).digest("hex").slice(0, 16),
        country: req.headers.get("x-vercel-ip-country") || null,
        city: req.headers.get("x-vercel-ip-city") || null,
        deviceType: detectDeviceType(userAgent),
        userAgent,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
