"use client";

/**
 * Live Classroom — Agora RTC Integration
 * Features: Video/Audio, Screen Share, Chat, Teacher Corrections
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  PhoneOff, MessageSquare, Users, Send,
  CheckCircle, Wifi, WifiOff, Star
} from "lucide-react";
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
  type IRemoteVideoTrack,
  type IRemoteAudioTrack,
  type UID,
} from "agora-rtc-sdk-ng";
import {
  fetchAgoraToken,
  createLocalTracks,
  publishTracks,
  leaveChannel,
  startScreenShare,
  subscribeToNetworkQuality,
  type RemoteUser,
} from "@/lib/agora";
import { subscribeToClassMessages, addDoc, collection, db, Collections, serverTimestamp } from "@/lib/firebase";
import { isDesignMockup } from "@/lib/design-mockup";
import type { ChatMessage } from "@/types";

function previewChatSeed(sessionId: string): ChatMessage[] {
  return [
    {
      id: "seed-1",
      classId: sessionId,
      userId: "teacher-preview",
      userName: "Ms. Emma Wells",
      userAvatar: "",
      message:
        "This is a design preview. Enable Agora (or set NEXT_PUBLIC_DESIGN_MOCKUP=false with valid keys) for a real call.",
      type: "text",
      sentAt: new Date(),
    },
  ];
}

function previewTeacherRemote(): RemoteUser {
  return {
    uid: "teacher-preview",
    displayName: "Ms. Emma Wells",
    isTeacher: true,
  };
}

// ── TYPES ─────────────────────────────────────────────────────
interface PageProps {
  params: { sessionId: string };
}

type ConnectionState = "idle" | "connecting" | "connected" | "disconnected" | "error";
type NetworkQuality = { uplink: number; downlink: number };

// ── NETWORK QUALITY INDICATOR ─────────────────────────────────
function NetworkIndicator({ quality }: { quality: NetworkQuality }) {
  const avg = (quality.uplink + quality.downlink) / 2;
  const color = avg <= 2 ? "text-green-500" : avg <= 4 ? "text-yellow-500" : "text-red-500";
  const Icon = avg <= 5 ? Wifi : WifiOff;
  const bars = avg <= 2 ? 3 : avg <= 4 ? 2 : 1;

  return (
    <div className={`flex items-center gap-1 ${color} text-xs`}>
      <Icon className="w-3 h-3" />
      <div className="flex gap-0.5">
        {[1,2,3].map(b => (
          <div
            key={b}
            className={`w-1 rounded-full transition-all ${b <= bars ? "bg-current" : "bg-current opacity-20"}`}
            style={{ height: `${b * 4}px`, alignSelf: "flex-end" }}
          />
        ))}
      </div>
    </div>
  );
}

// ── REMOTE VIDEO TILE ─────────────────────────────────────────
function RemoteVideoTile({ user, isTeacher }: { user: RemoteUser; isTeacher?: boolean }) {
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user.videoTrack && videoRef.current) {
      user.videoTrack.play(videoRef.current);
    }
    return () => { user.videoTrack?.stop(); };
  }, [user.videoTrack]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-3xl border-4 border-[#fbbf24]/25 bg-[#3b1482]">
      <div ref={videoRef} className="w-full h-full" />
      {!user.videoTrack && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#2e1065]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#fbbf24]/50 bg-[#3b1482] text-2xl font-black text-[#fbbf24]">
            {user.displayName?.[0] ?? "?"}
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
          {isTeacher && <Star className="w-3 h-3 text-star-400 fill-star-400" />}
          {user.displayName ?? `User ${user.uid}`}
        </span>
        {!user.audioTrack && (
          <MicOff className="w-4 h-4 text-red-400" />
        )}
      </div>
    </div>
  );
}

// ── CHAT PANEL ────────────────────────────────────────────────
function ChatPanel({
  messages,
  onSend,
  currentUserId,
  currentUserName,
}: {
  messages: ChatMessage[];
  onSend: (msg: string, type?: ChatMessage["type"]) => void;
  currentUserId: string;
  currentUserName: string;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-4 border-[#fbbf24]/25 bg-[#3b1482]">
      <div className="flex items-center gap-2 border-b-2 border-[#fbbf24]/25 px-4 py-3">
        <MessageSquare className="h-4 w-4 text-[#fbbf24]" />
        <span className="text-xs font-black uppercase tracking-widest text-white">Live chat</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg) => {
          const isOwn = msg.userId === currentUserId;
          const isCorrection = msg.type === "correction";

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
            >
              {isCorrection ? (
                <div className="bg-amber-900/40 border border-amber-600/50 rounded-xl p-2 max-w-xs">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-1">
                    <CheckCircle className="w-3 h-3" /> Teacher Correction
                  </div>
                  <p className="text-amber-100 text-xs leading-relaxed">{msg.message}</p>
                </div>
              ) : (
                <div
                  className={`max-w-xs rounded-2xl px-3 py-2 text-xs font-bold leading-relaxed ${
                    isOwn ? "bg-[#fbbf24] text-[#2e1065]" : "border border-[#fbbf24]/30 bg-[#2e1065] text-white"
                  }`}
                >
                  {!isOwn && (
                    <div className="mb-0.5 text-[10px] font-black uppercase tracking-wider text-[#fbbf24]">
                      {msg.userName}
                    </div>
                  )}
                  {msg.message}
                </div>
              )}
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t-2 border-[#fbbf24]/25 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Message..."
            className="flex-1 rounded-xl border-2 border-[#fbbf24]/30 bg-[#2e1065] px-3 py-2 text-xs text-white placeholder:text-white/40 focus:border-[#fbbf24] focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fbbf24] text-[#2e1065] transition-colors hover:bg-white disabled:opacity-40"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN CLASSROOM PAGE ───────────────────────────────────────
export default function ClassroomPage({ params }: PageProps) {
  const { sessionId } = params;

  // Agora state
  const clientRef  = useRef<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers]         = useState<RemoteUser[]>([]);
  const [screenTrack, setScreenTrack]         = useState<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);

  // UI state
  const [micOn, setMicOn]       = useState(true);
  const [camOn, setCamOn]       = useState(true);
  const [sharing, setSharing]   = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [networkQuality, setNetworkQuality]   = useState<NetworkQuality>({ uplink: 1, downlink: 1 });

  // Chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [layoutPreview, setLayoutPreview] = useState(isDesignMockup);

  // ── CONNECT ─────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setConnectionState("connecting");
    try {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // Get token from server (never expose appCertificate in browser)
      const uid = "demo-user-123"; // Replace with auth.currentUser.uid
      const token = await fetchAgoraToken(sessionId, uid, "publisher");
      const agoraUid = await client.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        sessionId,
        token,
        uid
      );

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        {},
        { encoderConfig: "720p_1" }
      );
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }
      await client.publish([audioTrack, videoTrack]);

      // Handle remote users
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        setRemoteUsers((prev) => {
          const existing = prev.find(u => u.uid === user.uid);
          if (existing) {
            return prev.map(u => u.uid === user.uid ? {
              ...u,
              videoTrack: mediaType === "video" ? user.videoTrack : u.videoTrack,
              audioTrack: mediaType === "audio" ? user.audioTrack : u.audioTrack,
            } : u);
          }
          return [...prev, {
            uid: user.uid,
            videoTrack: mediaType === "video" ? user.videoTrack : undefined,
            audioTrack: mediaType === "audio" ? user.audioTrack : undefined,
            displayName: `User ${user.uid}`,
          }];
        });
        if (mediaType === "audio") user.audioTrack?.play();
      });

      client.on("user-unpublished", (user, mediaType) => {
        setRemoteUsers(prev => prev.map(u =>
          u.uid === user.uid
            ? { ...u, videoTrack: mediaType === "video" ? undefined : u.videoTrack, audioTrack: mediaType === "audio" ? undefined : u.audioTrack }
            : u
        ));
      });

      client.on("user-left", (user) => {
        setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
      });

      // Network quality
      subscribeToNetworkQuality(client, (uplink, downlink) => {
        setNetworkQuality({ uplink, downlink });
      });

      setConnectionState("connected");
    } catch (err) {
      console.error("Agora connection error:", err);
      setLayoutPreview(true);
      setConnectionState("connected");
      setMessages(previewChatSeed(sessionId));
      setRemoteUsers([previewTeacherRemote()]);
    }
  }, [sessionId]);

  // ── DISCONNECT ───────────────────────────────────────────────
  const disconnect = useCallback(async () => {
    if (clientRef.current) {
      await leaveChannel(clientRef.current, [localVideoTrack, localAudioTrack, screenTrack]);
      clientRef.current = null;
    }
    setConnectionState("disconnected");
    window.history.back();
  }, [localVideoTrack, localAudioTrack, screenTrack]);

  // ── TOGGLE MIC ───────────────────────────────────────────────
  const toggleMic = useCallback(async () => {
    if (layoutPreview) {
      setMicOn((m) => !m);
      return;
    }
    if (!localAudioTrack) return;
    if (micOn) {
      await localAudioTrack.setEnabled(false);
    } else {
      await localAudioTrack.setEnabled(true);
    }
    setMicOn(!micOn);
  }, [localAudioTrack, micOn, layoutPreview]);

  // ── TOGGLE CAM ───────────────────────────────────────────────
  const toggleCam = useCallback(async () => {
    if (layoutPreview) {
      setCamOn((c) => !c);
      return;
    }
    if (!localVideoTrack) return;
    if (camOn) {
      await localVideoTrack.setEnabled(false);
    } else {
      await localVideoTrack.setEnabled(true);
    }
    setCamOn(!camOn);
  }, [localVideoTrack, camOn, layoutPreview]);

  // ── SCREEN SHARE ─────────────────────────────────────────────
  const toggleScreenShare = useCallback(async () => {
    if (layoutPreview) {
      setSharing((s) => !s);
      return;
    }
    if (!clientRef.current) return;
    if (sharing && screenTrack) {
      screenTrack.stop();
      screenTrack.close();
      await clientRef.current.unpublish(screenTrack);
      setScreenTrack(null);
      setSharing(false);
    } else {
      const track = await startScreenShare(clientRef.current, () => {
        setSharing(false);
        setScreenTrack(null);
      });
      setScreenTrack(track);
      setSharing(true);
    }
  }, [sharing, screenTrack, layoutPreview]);

  // ── CHAT ─────────────────────────────────────────────────────
  useEffect(() => {
    if (layoutPreview) return;
    const unsubscribe = subscribeToClassMessages(sessionId, setMessages);
    return () => unsubscribe();
  }, [sessionId, layoutPreview]);

  const sendMessage = useCallback(
    async (text: string, type: ChatMessage["type"] = "text") => {
      if (layoutPreview) {
        const msg: ChatMessage = {
          id: `local-${Date.now()}`,
          classId: sessionId,
          userId: "demo-user-123",
          userName: "Sophie Martin",
          userAvatar: "",
          message: text,
          type,
          sentAt: new Date(),
        };
        setMessages((prev) => [...prev, msg]);
        return;
      }
      await addDoc(collection(db, Collections.CHAT_MESSAGES(sessionId)), {
        userId: "demo-user-123",
        userName: "Sophie Martin",
        userAvatar: "",
        message: text,
        type,
        sentAt: serverTimestamp(),
      });
    },
    [sessionId, layoutPreview]
  );

  // Auto-connect on mount (or design preview without Agora)
  useEffect(() => {
    if (isDesignMockup) {
      setConnectionState("connected");
      setLayoutPreview(true);
      setMessages(previewChatSeed(sessionId));
      setRemoteUsers([previewTeacherRemote()]);
      return;
    }
    connect();
    return () => {
      if (clientRef.current) {
        leaveChannel(clientRef.current, [localVideoTrack, localAudioTrack, screenTrack]);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play local video when track is ready
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current && camOn) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack, camOn]);

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-[#2e1065] font-bold">
      {layoutPreview && (
        <div className="border-b-4 border-[#fbbf24]/40 bg-[#3b1482] px-4 py-2 text-center text-[10px] font-black uppercase tracking-wider text-[#fbbf24]">
          Preview — no real video. Configure Agora or{" "}
          <code className="text-white/90">NEXT_PUBLIC_DESIGN_MOCKUP=true</code>
        </div>
      )}
      <header className="flex items-center justify-between border-b-4 border-[#fbbf24]/30 bg-[#3b1482] px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-black uppercase tracking-tight text-white md:text-base">
            ⭐ Live class
          </span>
          <span
            className={`rounded-full border-2 px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
              layoutPreview
                ? "border-[#fbbf24] text-[#fbbf24]"
                : connectionState === "connected"
                  ? "border-green-400 text-green-300"
                  : connectionState === "connecting"
                    ? "border-yellow-400 text-yellow-200"
                    : "border-red-400 text-red-300"
            }`}
          >
            {layoutPreview
              ? "Preview"
              : connectionState === "connected"
                ? "● Live"
                : connectionState === "connecting"
                  ? "Connecting..."
                  : "Disconnected"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <NetworkIndicator quality={networkQuality} />
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/60">
            <Users className="h-3.5 w-3.5 text-[#fbbf24]" />
            {remoteUsers.length + 1} in room
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 p-4 grid gap-4 auto-rows-fr" style={{
          gridTemplateColumns: remoteUsers.length > 0 ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr",
        }}>
          {/* Local video */}
          <div className="relative aspect-video overflow-hidden rounded-3xl border-4 border-[#fbbf24]/25 bg-[#3b1482]">
            <div ref={localVideoRef} className="w-full h-full" />
            {(layoutPreview || !camOn) && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#2e1065]">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#fbbf24] bg-[#3b1482] text-3xl font-black text-[#fbbf24]">
                  S
                </div>
              </div>
            )}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <span className="bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                You
              </span>
              <div className="flex items-center gap-1.5">
                {!micOn && <MicOff className="w-4 h-4 text-red-400" />}
                {!camOn && <VideoOff className="w-4 h-4 text-red-400" />}
              </div>
            </div>
          </div>

          {/* Remote users */}
          {remoteUsers.map((user, i) => (
            <RemoteVideoTile key={user.uid.toString()} user={user} isTeacher={i === 0} />
          ))}

          {/* Connecting state */}
          {connectionState === "connecting" && !layoutPreview && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#2e1065]/90 backdrop-blur-sm">
              <div className="text-center">
                <div className="mb-4 text-4xl animate-float">📡</div>
                <p className="text-sm font-black uppercase tracking-wider text-[#fbbf24]">Connecting…</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat sidebar */}
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0 border-l-4 border-[#fbbf24]/25 p-4"
              style={{ width: 320 }}
            >
              <ChatPanel
                messages={messages}
                onSend={sendMessage}
                currentUserId="demo-user-123"
                currentUserName="Sophie Martin"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-center gap-4 border-t-4 border-[#fbbf24]/30 bg-[#3b1482] p-4">
        {/* Mic */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMic}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#fbbf24]/30 transition-colors ${
            micOn
              ? "bg-[#2e1065] text-[#fbbf24] hover:border-[#fbbf24]"
              : "border-red-500 bg-red-600 text-white hover:bg-red-500"
          }`}
          title={micOn ? "Mute microphone" : "Unmute microphone"}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </motion.button>

        {/* Camera */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleCam}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#fbbf24]/30 transition-colors ${
            camOn
              ? "bg-[#2e1065] text-[#fbbf24] hover:border-[#fbbf24]"
              : "border-red-500 bg-red-600 text-white hover:bg-red-500"
          }`}
          title={camOn ? "Turn off camera" : "Turn on camera"}
        >
          {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </motion.button>

        {/* Screen share */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleScreenShare}
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-colors ${
            sharing
              ? "border-[#fbbf24] bg-[#fbbf24] text-[#2e1065] hover:bg-white"
              : "border-[#fbbf24]/30 bg-[#2e1065] text-[#fbbf24] hover:border-[#fbbf24]"
          }`}
          title={sharing ? "Stop sharing screen" : "Share screen"}
        >
          {sharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
        </motion.button>

        {/* Chat toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setChatOpen(!chatOpen)}
          className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-colors ${
            chatOpen
              ? "border-[#fbbf24] bg-[#fbbf24] text-[#2e1065]"
              : "border-[#fbbf24]/30 bg-[#2e1065] text-[#fbbf24] hover:border-[#fbbf24]"
          }`}
          title="Toggle chat"
        >
          <MessageSquare className="w-5 h-5" />
          {messages.length > 0 && !chatOpen && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full text-xs flex items-center justify-center">
              {Math.min(messages.length, 9)}
            </span>
          )}
        </motion.button>

        {/* Divider */}
        <div className="h-8 w-px bg-[#fbbf24]/30" />

        {/* Leave */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={disconnect}
          className="w-12 h-12 rounded-2xl bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors"
          title="Leave class"
        >
          <PhoneOff className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </div>
  );
}
