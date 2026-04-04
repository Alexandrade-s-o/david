/**
 * Agora RTC Integration — Le Petit Anglais
 *
 * SDK: agora-rtc-sdk-ng
 * Docs: https://api-ref.agora.io/en/video-sdk/web/4.x/
 *
 * Tokens should be generated server-side (Next.js API route).
 * Never expose appCertificate on the client.
 */

import AgoraRTC, {
  type IAgoraRTCClient,
  type ILocalVideoTrack,
  type ILocalAudioTrack,
  type IRemoteVideoTrack,
  type IRemoteAudioTrack,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
  type UID,
} from "agora-rtc-sdk-ng";

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;

// ── TYPES ─────────────────────────────────────────────────────
export interface RemoteUser {
  uid: UID;
  videoTrack?: IRemoteVideoTrack;
  audioTrack?: IRemoteAudioTrack;
  displayName?: string;
  isTeacher?: boolean;
}

export interface AgoraSession {
  client: IAgoraRTCClient;
  localVideoTrack: ICameraVideoTrack | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  remoteUsers: Map<UID, RemoteUser>;
}

// ── HOOK-FRIENDLY CLIENT FACTORY ──────────────────────────────
export function createAgoraClient(mode: "live" | "rtc" = "rtc"): IAgoraRTCClient {
  return AgoraRTC.createClient({ mode, codec: "vp8" });
}

// ── TOKEN FETCH (server-side generated) ───────────────────────
export async function fetchAgoraToken(
  channelName: string,
  uid: string | number,
  role: "publisher" | "audience" = "publisher"
): Promise<string> {
  const res = await fetch("/api/agora/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channelName, uid, role }),
  });
  if (!res.ok) throw new Error("Failed to fetch Agora token");
  const { token } = await res.json();
  return token as string;
}

// ── JOIN CHANNEL ──────────────────────────────────────────────
export async function joinChannel(
  client: IAgoraRTCClient,
  channelName: string,
  token: string,
  uid: string | number | null = null
): Promise<UID> {
  return client.join(APP_ID, channelName, token, uid);
}

// ── LOCAL TRACKS ──────────────────────────────────────────────
export async function createLocalTracks(): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
  return AgoraRTC.createMicrophoneAndCameraTracks(
    {},
    { encoderConfig: "720p_1" }
  );
}

export async function createAudioTrack(): Promise<IMicrophoneAudioTrack> {
  return AgoraRTC.createMicrophoneAudioTrack({});
}

// ── PUBLISH / UNPUBLISH ───────────────────────────────────────
export async function publishTracks(
  client: IAgoraRTCClient,
  tracks: (ILocalVideoTrack | ILocalAudioTrack)[]
): Promise<void> {
  await client.publish(tracks);
}

export async function unpublishTracks(
  client: IAgoraRTCClient,
  tracks: (ILocalVideoTrack | ILocalAudioTrack)[]
): Promise<void> {
  await client.unpublish(tracks);
}

// ── LEAVE ─────────────────────────────────────────────────────
export async function leaveChannel(
  client: IAgoraRTCClient,
  tracks: (ILocalVideoTrack | ILocalAudioTrack | null)[]
): Promise<void> {
  tracks.forEach((t) => {
    t?.stop();
    t?.close();
  });
  await client.leave();
}

// ── SCREEN SHARE ──────────────────────────────────────────────
export async function startScreenShare(
  client: IAgoraRTCClient,
  onStop?: () => void
): Promise<ILocalVideoTrack> {
  const screenTrack = await AgoraRTC.createScreenVideoTrack(
    { encoderConfig: "1080p_1", optimizationMode: "detail" },
    "disable"
  );
  const track = Array.isArray(screenTrack) ? screenTrack[0] : screenTrack;
  // Detect when user clicks "Stop sharing" in the browser
  (track as ICameraVideoTrack).on?.("track-ended", () => {
    onStop?.();
  });
  await client.publish(track);
  return track;
}

// ── VIRTUAL BACKGROUND (optional) ────────────────────────────
export async function setVirtualBackground(
  videoTrack: ICameraVideoTrack,
  type: "blur" | "image",
  imageUrl?: string
): Promise<void> {
  // Requires @agora-io/extension-virtual-background
  // Shown here as placeholder for the integration pattern
  console.warn("Virtual background requires the Agora Virtual Background extension.");
}

// ── DEVICE MANAGEMENT ─────────────────────────────────────────
export async function getAvailableCameras() {
  return AgoraRTC.getCameras();
}

export async function getAvailableMicrophones() {
  return AgoraRTC.getMicrophones();
}

export async function switchCamera(
  videoTrack: ICameraVideoTrack,
  deviceId: string
): Promise<void> {
  await videoTrack.setDevice(deviceId);
}

// ── NETWORK QUALITY MONITOR ───────────────────────────────────
export function subscribeToNetworkQuality(
  client: IAgoraRTCClient,
  callback: (uplinkQuality: number, downlinkQuality: number) => void
): () => void {
  const handler = ({ uplinkNetworkQuality, downlinkNetworkQuality }: {
    uplinkNetworkQuality: number;
    downlinkNetworkQuality: number;
  }) => {
    callback(uplinkNetworkQuality, downlinkNetworkQuality);
  };
  client.on("network-quality", handler);
  return () => client.off("network-quality", handler);
}
