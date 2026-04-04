/**
 * API Route: Generate Agora Token (Server-Side)
 * POST /api/agora/token
 *
 * NEVER expose AGORA_APP_CERTIFICATE to the client.
 * This route runs on the server, signs the token, and returns it.
 *
 * Install: npm install agora-token
 */

import { NextRequest, NextResponse } from "next/server";
// import { RtcTokenBuilder, RtcRole } from "agora-token"; // Uncomment when package installed

const APP_ID          = process.env.AGORA_APP_ID!;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!; // server-side only
const TOKEN_EXPIRE_SECONDS = 3600; // 1 hour

export async function POST(req: NextRequest) {
  try {
    const { channelName, uid, role = "publisher" } = await req.json() as {
      channelName: string;
      uid: string | number;
      role?: "publisher" | "audience";
    };

    if (!channelName || uid === undefined) {
      return NextResponse.json(
        { error: "channelName and uid are required" },
        { status: 400 }
      );
    }

    // Auth check — ensure the caller is an authenticated user
    // In production, validate the Firebase ID token from the Authorization header:
    //
    // const idToken = req.headers.get("Authorization")?.replace("Bearer ", "");
    // const decodedToken = await adminAuth.verifyIdToken(idToken);
    // if (decodedToken.uid !== String(uid)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const expirationTime = Math.floor(Date.now() / 1000) + TOKEN_EXPIRE_SECONDS;

    // ── AGORA TOKEN GENERATION ─────────────────────────────────
    // Uncomment the lines below once `agora-token` is installed:
    //
    // const agoraRole = role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    // const token = RtcTokenBuilder.buildTokenWithUid(
    //   APP_ID,
    //   APP_CERTIFICATE,
    //   channelName,
    //   Number(uid),
    //   agoraRole,
    //   expirationTime,
    //   expirationTime
    // );
    //
    // return NextResponse.json({ token, expiresAt: expirationTime });

    // ── PLACEHOLDER (remove in production) ────────────────────
    // In testing mode with no certificate, Agora accepts null tokens.
    // This returns null so the frontend can still connect in dev:
    console.warn("[Agora] Using null token — configure APP_CERTIFICATE for production");
    return NextResponse.json({
      token: null,
      expiresAt: expirationTime,
      note: "Set AGORA_APP_CERTIFICATE env var and uncomment agora-token code",
    });

  } catch (err) {
    console.error("[Agora token] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
