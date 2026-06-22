// Developed by Raj Dev (AstraToonix)

/**
 * FILE: db.js
 * PURPOSE: Prisma client singleton + full database schema (via prisma/schema.prisma reference)
 * Run: npx prisma db push  →  to sync schema to Neon DB
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Developed by Raj Dev (AstraToonix)

export default prisma;

/**
 * ─────────────────────────────────────────────────────
 * PRISMA SCHEMA  →  paste this into:  prisma/schema.prisma
 * ─────────────────────────────────────────────────────
 *
 * generator client {
 *   provider = "prisma-client-js"
 * }
 *
 * datasource db {
 *   provider  = "postgresql"
 *   url       = env("DATABASE_URL")
 * }
 *
 * model User {
 *   id               String    @id @default(cuid())
 *   name             String?
 *   firstName        String?
 *   lastName         String?
 *   email            String    @unique
 *   emailVerified    DateTime?
 *   image            String?
 *   username         String?   @unique
 *   createdAt        DateTime  @default(now())
 *   updatedAt        DateTime  @updatedAt
 *   receivedMessages Message[] @relation("ReceivedMessages")
 *   sentMessages     Message[] @relation("SentMessages")
 *   accounts         Account[]
 *   sessions         Session[]
 * }
 *
 * model Message {
 *   id         String   @id @default(cuid())
 *   content    String   @db.Text
 *   createdAt  DateTime @default(now())
 *   receiverId String
 *   receiver   User     @relation("ReceivedMessages", fields: [receiverId], references: [id], onDelete: Cascade)
 *   senderId   String
 *   sender     User     @relation("SentMessages",     fields: [senderId],   references: [id], onDelete: Cascade)
 * }
 *
 * model Account {
 *   id                String  @id @default(cuid())
 *   userId            String
 *   type              String
 *   provider          String
 *   providerAccountId String
 *   refresh_token     String? @db.Text
 *   access_token      String? @db.Text
 *   expires_at        Int?
 *   token_type        String?
 *   scope             String?
 *   id_token          String? @db.Text
 *   session_state     String?
 *   user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
 *   @@unique([provider, providerAccountId])
 * }
 *
 * model Session {
 *   id           String   @id @default(cuid())
 *   sessionToken String   @unique
 *   userId       String
 *   expires      DateTime
 *   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
 * }
 *
 * model VerificationToken {
 *   identifier String
 *   token      String   @unique
 *   expires    DateTime
 *   @@unique([identifier, token])
 * }
 */

// Developed by Raj Dev (AstraToonix)
