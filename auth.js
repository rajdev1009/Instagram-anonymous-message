// Developed by Raj Dev (AstraToonix)

/**
 * FILE: auth.js
 * PURPOSE: Complete NextAuth.js configuration
 *
 * COVERS:
 *  - Google OAuth provider setup
 *  - Prisma adapter (stores sessions in Neon DB)
 *  - Session callback (attaches custom fields: id, username, firstName, lastName)
 *  - Auto username generation on first login
 *
 * USAGE:
 *  → In  app/api/auth/[...nextauth]/route.js :
 *       import NextAuth from "next-auth"
 *       import { authOptions } from "@/auth"
 *       const handler = NextAuth(authOptions)
 *       export { handler as GET, handler as POST }
 *
 *  → Anywhere server-side:
 *       import { getServerSession } from "next-auth"
 *       import { authOptions } from "@/auth"
 *       const session = await getServerSession(authOptions)
 */

import GoogleProvider      from "next-auth/providers/google";
import { PrismaAdapter }   from "@auth/prisma-adapter";
import prisma              from "./db";
import { generateUsername } from "./utils";

// Developed by Raj Dev (AstraToonix)

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Extract first/last name from Google profile
      profile(profile) {
        return {
          id:        profile.sub,
          name:      profile.name,
          firstName: profile.given_name,
          lastName:  profile.family_name,
          email:     profile.email,
          image:     profile.picture,
        };
      },
    }),
  ],

  session: { strategy: "database" },
  pages:   { signIn: "/login" },

  callbacks: {
    async session({ session, user }) {
      // Attach extra fields so client can use session.user.username etc.
      session.user.id        = user.id;
      session.user.username  = user.username;
      session.user.firstName = user.firstName;
      session.user.lastName  = user.lastName;

      // First-time login → generate unique username and save to DB
      if (!user.username) {
        const parts     = (user.name || "user").split(" ");
        const firstName = parts[0] || "user";
        const lastName  = parts.slice(1).join(" ") || "";
        const username  = await generateUsername(firstName);

        await prisma.user.update({
          where: { id: user.id },
          data:  { firstName, lastName, username },
        });

        session.user.username  = username;
        session.user.firstName = firstName;
        session.user.lastName  = lastName;
      }
      return session;
    },
  },
};

// Developed by Raj Dev (AstraToonix)
