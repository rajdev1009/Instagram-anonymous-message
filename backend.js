// Developed by Raj Dev (AstraToonix)

/**
 * FILE: backend.js
 * PURPOSE: All backend API route handlers consolidated
 *
 * HOW TO USE — create these files in your Next.js project:
 *
 * ┌─ app/api/auth/[...nextauth]/route.js  → paste SECTION 1
 * ├─ app/api/messages/send/route.js       → paste SECTION 2
 * ├─ app/api/messages/inbox/route.js      → paste SECTION 3
 * └─ app/api/user/profile/route.js        → paste SECTION 4
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 ── app/api/auth/[...nextauth]/route.js
// ═══════════════════════════════════════════════════════════════════════════════
/*
import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 ── app/api/messages/send/route.js
// POST /api/messages/send
// Body: { receiverUsername: string, content: string }
// Silently captures sender identity and saves with message
// ═══════════════════════════════════════════════════════════════════════════════

import { getServerSession } from "next-auth";
import { authOptions }      from "@/auth";
import prisma               from "@/db";
import { NextResponse }     from "next/server";

// Developed by Raj Dev (AstraToonix)

export async function POST_sendMessage(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Login required to send a message." }, { status: 401 });

    const { receiverUsername, content } = await request.json();

    if (!receiverUsername || !content?.trim())
      return NextResponse.json({ error: "Receiver and content are required." }, { status: 400 });

    if (content.trim().length > 500)
      return NextResponse.json({ error: "Message cannot exceed 500 characters." }, { status: 400 });

    const receiver = await prisma.user.findUnique({
      where:  { username: receiverUsername },
      select: { id: true },
    });
    if (!receiver)
      return NextResponse.json({ error: "Recipient not found." }, { status: 404 });

    const message = await prisma.message.create({
      data: {
        content:    content.trim(),
        receiverId: receiver.id,
        senderId:   session.user.id, // ← silently captured, hidden in standard UI
      },
    });

    return NextResponse.json({ success: true, messageId: message.id }, { status: 201 });
  } catch (err) {
    console.error("[SEND_ERROR]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 ── app/api/messages/inbox/route.js
// GET /api/messages/inbox
// Returns messages for logged-in user created within last 24 hours ONLY
// Sender fields included (hidden in UI unless Decoded Mode active)
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET_inbox() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const messages = await prisma.message.findMany({
      where: {
        receiverId: session.user.id,
        createdAt:  { gte: twentyFourHoursAgo }, // ← strict 24h expiry
      },
      select: {
        id:        true,
        content:   true,
        createdAt: true,
        sender: {
          select: {
            firstName: true,
            lastName:  true,
            email:     true,
            image:     true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    console.error("[INBOX_ERROR]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 ── app/api/user/profile/route.js
// GET /api/user/profile
// Returns current user's profile including their shareable username
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET_profile() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const user = await prisma.user.findUnique({
      where:  { id: session.user.id },
      select: {
        id:        true,
        firstName: true,
        lastName:  true,
        email:     true,
        image:     true,
        username:  true,
        createdAt: true,
      },
    });

    if (!user)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("[PROFILE_ERROR]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTE: To wire these up in Next.js App Router, create the route files as shown
// at the top of this file and import + re-export the relevant handler.
// Example for send/route.js:
//   import { POST_sendMessage as POST } from "@/backend";
//   export { POST };
// ═══════════════════════════════════════════════════════════════════════════════

// Developed by Raj Dev (AstraToonix)
