// Developed by Raj Dev (AstraToonix)

/**
 * FILE: frontend.js
 * PURPOSE: All React components and Next.js pages consolidated
 *
 * COPY EACH SECTION into the corresponding path in your Next.js project:
 *
 * ┌─ SECTION 1  →  app/layout.js
 * ├─ SECTION 2  →  app/page.js                    (root redirect)
 * ├─ SECTION 3  →  app/login/page.js
 * ├─ SECTION 4  →  app/dashboard/page.js
 * ├─ SECTION 5  →  app/u/[username]/page.js
 * ├─ SECTION 6  →  components/providers/SessionProvider.jsx
 * ├─ SECTION 7  →  components/Navbar.jsx
 * ├─ SECTION 8  →  components/LoginButton.jsx
 * ├─ SECTION 9  →  components/AnimatedWrapper.jsx
 * ├─ SECTION 10 →  components/TypewriterInput.jsx
 * ├─ SECTION 11 →  components/ProfileHeader.jsx
 * ├─ SECTION 12 →  components/MessageInput.jsx
 * ├─ SECTION 13 →  components/MessageCard.jsx
 * ├─ SECTION 14 →  components/InboxList.jsx
 * └─ SECTION 15 →  components/DecodeModal.jsx
 */

"use client"; // (remove this line from server components — see each section)

// Developed by Raj Dev (AstraToonix)

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 ── app/layout.js   (SERVER COMPONENT — no "use client")
// ═══════════════════════════════════════════════════════════════════════════════
/*
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AnonMsg — Send Anonymous Messages",
  description: "Share your unique link and receive completely anonymous messages.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-brand-dark antialiased">
        <SessionProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 ── app/page.js   (SERVER COMPONENT — no "use client")
// Root page: redirects to /dashboard if logged in, else /login
// ═══════════════════════════════════════════════════════════════════════════════
/*
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");
  else redirect("/login");
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 ── app/login/page.js   ("use client")
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import LoginButton from "@/components/LoginButton";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) router.push("/dashboard");
  }, [session, router]);

  if (status === "loading")
    return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-2xl p-10 max-w-md w-full text-center shadow-2xl"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-6">🔒</motion.div>
        <h1 className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent mb-3">AnonMsg</h1>
        <p className="text-gray-400 mb-2 text-sm leading-relaxed">Share your link. Receive honest, anonymous messages from anyone.</p>
        <p className="text-gray-500 text-xs mb-8">Messages expire in 24 hours. Your identity stays hidden.</p>
        <LoginButton onSignIn={() => signIn("google")} />
        <p className="text-gray-600 text-xs mt-6">By signing in, you agree to keep things respectful.</p>
      </motion.div>
    </div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 ── app/dashboard/page.js   ("use client")
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import InboxList from "@/components/InboxList";
import DecodeModal from "@/components/DecodeModal";
import AnimatedWrapper from "@/components/AnimatedWrapper";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [isDecoded, setIsDecoded]     = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [copied, setCopied]           = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/login"); }, [status, router]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/messages/inbox");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (session?.user) fetchMessages(); }, [session, fetchMessages]);

  const profileUrl = typeof window !== "undefined" && session?.user?.username
    ? `${window.location.origin}/u/${session.user.username}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || !session?.user)
    return <div className="flex items-center justify-center min-h-[80vh]"><div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <AnimatedWrapper className="max-w-2xl mx-auto px-4 py-8">
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Your Link</h2>
            <p className="text-xs text-gray-500 font-mono break-all">{profileUrl}</p>
          </div>
          <div className="flex gap-2 items-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="text-xs px-3 py-1.5 rounded-lg bg-brand-gradient text-white font-medium">
              {copied ? "✓ Copied!" : "Copy Link"}
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setShowModal(true)} title="Decode"
              className={`text-lg p-1.5 rounded-lg transition-colors ${isDecoded ? "text-yellow-400" : "text-gray-600 hover:text-gray-400"}`}>
              🔑
            </motion.button>
          </div>
        </div>
        {isDecoded && (
          <div className="mt-3 text-xs text-yellow-400 bg-yellow-400/10 rounded-lg px-3 py-2">
            🔓 Decoded Mode Active — Sender identities are now visible.
          </div>
        )}
      </div>

      <InboxList messages={messages} loading={loading} isDecoded={isDecoded} onRefresh={fetchMessages} />
      <DecodeModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={() => setIsDecoded(true)} />
    </AnimatedWrapper>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 ── app/u/[username]/page.js   (SERVER COMPONENT — no "use client")
// ═══════════════════════════════════════════════════════════════════════════════
/*
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/db";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import MessageInput from "@/components/MessageInput";

export default async function ProfilePage({ params }) {
  const { username } = params;
  const profileUser = await prisma.user.findUnique({
    where: { username },
    select: { id: true, firstName: true, lastName: true, image: true, username: true },
  });
  if (!profileUser) notFound();

  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user?.id;

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <ProfileHeader user={profileUser} />
      <MessageInput receiverUsername={username} isAuthenticated={isAuthenticated} />
    </div>
  );
}

export async function generateMetadata({ params }) {
  return {
    title: `Send ${params.username} an anonymous message — AnonMsg`,
    description: `Drop an honest, anonymous message to ${params.username}. They'll never know it was you.`,
  };
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 ── components/providers/SessionProvider.jsx   ("use client")
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
export default function SessionProvider({ children }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 ── components/Navbar.jsx   ("use client")
// Blinking glow-pulse first name in navbar
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-16">
      <div className="max-w-4xl mx-auto h-full px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-black bg-brand-gradient bg-clip-text text-transparent">
          🔒 AnonMsg
        </Link>
        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 hidden sm:block">
              Welcome,{" "}
              <span className="font-bold text-purple-400 glow-pulse">
                {session.user.firstName || session.user.name?.split(" ")[0] || "Friend"}
              </span>
            </span>
            {session.user.image && (
              <Image src={session.user.image} alt="avatar" width={32} height={32}
                className="rounded-full ring-2 ring-purple-500/40" />
            )}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors">
              Sign Out
            </motion.button>
          </div>
        ) : (
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 ── components/LoginButton.jsx   ("use client")
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { motion } from "framer-motion";
export default function LoginButton({ onSignIn }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(168,85,247,0.4)" }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onSignIn}
      className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold rounded-xl py-3 px-6 shadow-lg">
      <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
      Continue with Google
    </motion.button>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 9 ── components/AnimatedWrapper.jsx   ("use client")
// Reusable fade-in + slide-up page animation wrapper
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { motion } from "framer-motion";
export default function AnimatedWrapper({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      className={className}>
      {children}
    </motion.div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 10 ── components/TypewriterInput.jsx   ("use client")
// Textarea with animated typewriter-style placeholder cycling through phrases
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { useState, useEffect, useRef } from "react";

const PHRASES = [
  "Send your anonymous message...",
  "Be honest, stay hidden...",
  "What's on your mind?",
  "Your identity is completely safe here...",
  "Say something real...",
];

export default function TypewriterInput({ value, onChange, disabled }) {
  const [displayText, setDisplayText] = useState("");
  const [phraseIdx, setPhraseIdx]     = useState(0);
  const [isDeleting, setIsDeleting]   = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const current = PHRASES[phraseIdx];
    const speed = isDeleting ? 40 : 70;
    ref.current = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, displayText.length + 1));
        if (displayText.length + 1 === current.length) setTimeout(() => setIsDeleting(true), 1800);
      } else {
        setDisplayText(current.slice(0, displayText.length - 1));
        if (displayText.length === 0) { setIsDeleting(false); setPhraseIdx(i => (i + 1) % PHRASES.length); }
      }
    }, speed);
    return () => clearTimeout(ref.current);
  }, [displayText, isDeleting, phraseIdx]);

  return (
    <div className="relative">
      <textarea value={value} onChange={onChange} disabled={disabled} maxLength={500} rows={5}
        className="w-full bg-transparent resize-none rounded-xl border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/60 transition-colors placeholder-transparent disabled:opacity-50 disabled:cursor-not-allowed" />
      {!value && !disabled && (
        <div className="absolute top-3 left-4 text-gray-500 text-sm pointer-events-none select-none typewriter-cursor">
          {displayText}
        </div>
      )}
    </div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 11 ── components/ProfileHeader.jsx   ("use client")
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfileHeader({ user }) {
  const displayName = user.firstName
    ? `${user.firstName}${user.lastName ? " " + user.lastName : ""}` : user.username;
  return (
    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className="flex flex-col items-center text-center mb-8">
      {user.image ? (
        <Image src={user.image} alt={displayName} width={80} height={80}
          className="rounded-full ring-4 ring-purple-500/30 mb-4 shadow-lg shadow-purple-500/20" />
      ) : (
        <div className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center text-3xl font-bold text-white mb-4">
          {displayName[0]?.toUpperCase()}
        </div>
      )}
      <h1 className="text-2xl font-bold text-white mb-1">
        Send <span className="bg-brand-gradient bg-clip-text text-transparent">{user.firstName || user.username}</span> a message
      </h1>
      <p className="text-gray-500 text-sm">They won&apos;t know who sent it. 100% anonymous.</p>
      <p className="text-gray-600 text-xs mt-1">⏳ Messages disappear after 24 hours</p>
    </motion.div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 12 ── components/MessageInput.jsx   ("use client")
// Disabled with warning when unauthenticated. Calls POST /api/messages/send
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypewriterInput from "./TypewriterInput";

export default function MessageInput({ receiverUsername, isAuthenticated }) {
  const [content, setContent] = useState("");
  const [status, setStatus]   = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async () => {
    if (!content.trim() || status === "loading") return;
    setStatus("loading"); setErrorMsg("");
    try {
      const res  = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverUsername, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send.");
      setStatus("success"); setContent("");
    } catch (err) { setErrorMsg(err.message); setStatus("error"); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
      {!isAuthenticated && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
          🔐 Please login with Gmail first to send a message.
        </div>
      )}
      <TypewriterInput value={content} onChange={e => setContent(e.target.value)}
        disabled={!isAuthenticated || status === "loading"} />
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-600">{content.length}/500</span>
        <motion.button
          whileHover={{ scale: isAuthenticated ? 1.04 : 1 }}
          whileTap={{ scale: isAuthenticated ? 0.96 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={handleSend}
          disabled={!isAuthenticated || !content.trim() || status === "loading"}
          className="px-5 py-2 rounded-xl bg-brand-gradient text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20">
          {status === "loading" ? "Sending..." : "Send Anonymously 🚀"}
        </motion.button>
      </div>
      <AnimatePresence>
        {status === "success" && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 text-green-400 text-sm text-center">
            ✅ Message sent! They&apos;ll never know it was you.
          </motion.p>
        )}
        {status === "error" && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-3 text-red-400 text-sm text-center">❌ {errorMsg}</motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 13 ── components/MessageCard.jsx   ("use client")
// Normal mode: anonymous. Decoded mode: shows real name + Gmail
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { motion } from "framer-motion";
import { formatRelativeTime } from "@/utils";

export default function MessageCard({ message, isDecoded, index }) {
  const { content, createdAt, sender } = message;
  const senderName = sender ? `${sender.firstName || ""} ${sender.lastName || ""}`.trim() || "Unknown" : "Unknown";
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }} className="glass rounded-xl p-5 hover:border-purple-500/20 transition-colors">
      <p className="text-white text-sm leading-relaxed whitespace-pre-wrap break-words mb-4">{content}</p>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {isDecoded ? (
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-3 py-2">
              <p className="text-yellow-300 text-xs font-semibold truncate">👤 {senderName}</p>
              <p className="text-yellow-400/70 text-xs font-mono truncate">✉️ {sender?.email || "unknown@gmail.com"}</p>
            </motion.div>
          ) : (
            <span className="text-xs text-gray-600">👤 Anonymous</span>
          )}
        </div>
        <span className="text-xs text-gray-600 whitespace-nowrap shrink-0">⏰ {formatRelativeTime(createdAt)}</span>
      </div>
    </motion.div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 14 ── components/InboxList.jsx   ("use client")
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { motion } from "framer-motion";
import MessageCard from "./MessageCard";

export default function InboxList({ messages, loading, isDecoded, onRefresh }) {
  if (loading) return (
    <div className="flex flex-col gap-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass rounded-xl p-5 animate-pulse">
          <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          📬 Inbox <span className="text-sm font-normal text-gray-500">(last 24h · {messages.length} message{messages.length !== 1 ? "s" : ""})</span>
        </h2>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={onRefresh} className="text-xs text-gray-500 hover:text-purple-400 transition-colors">↻ Refresh</motion.button>
      </div>
      {messages.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass rounded-xl py-14 text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500 text-sm">No messages yet.</p>
          <p className="text-gray-600 text-xs mt-1">Share your link and wait for the honesty to roll in!</p>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <MessageCard key={msg.id} message={msg} isDecoded={isDecoded} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 15 ── components/DecodeModal.jsx   ("use client")
// Secret password: astratoonix143  →  activates Decoded Mode
// ═══════════════════════════════════════════════════════════════════════════════
/*
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DECODE_PASSWORD = "astratoonix143";

export default function DecodeModal({ isOpen, onClose, onSuccess }) {
  const [input, setInput]     = useState("");
  const [shake, setShake]     = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = () => {
    if (input === DECODE_PASSWORD) {
      setUnlocked(true);
      setTimeout(() => { onSuccess(); onClose(); setInput(""); setUnlocked(false); }, 800);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={shake ? { scale: 1, opacity: 1, x: [0, -10, 10, -10, 10, 0] } : { scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={e => e.stopPropagation()}
            className="glass rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <div className="text-4xl mb-4">{unlocked ? "🔓" : "🔑"}</div>
            <h3 className="text-lg font-bold text-white mb-2">{unlocked ? "Access Granted!" : "Decode Mode"}</h3>
            <p className="text-gray-500 text-xs mb-5">Enter the secret password to reveal sender identities.</p>
            {!unlocked && (
              <>
                <input type="password" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
                  placeholder="Enter secret password..." autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm text-center focus:outline-none focus:border-purple-500/60 mb-4 tracking-widest" />
                <div className="flex gap-3">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={onClose}
                    className="flex-1 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:text-white transition-colors">Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                    className="flex-1 py-2 rounded-xl bg-brand-gradient text-white text-sm font-semibold">Unlock</motion.button>
                </div>
              </>
            )}
            {unlocked && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-green-400 text-sm font-medium">✅ Decoded Mode Activated!</motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
*/

// Developed by Raj Dev (AstraToonix)
