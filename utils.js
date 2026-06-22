// Developed by Raj Dev (AstraToonix)

/**
 * FILE: utils.js
 * PURPOSE: Shared utility functions used across the app
 *          - Username generator (unique slug for each user)
 *          - Relative time formatter
 *          - String truncation helper
 */

import prisma from "./db";

// ─── Username Generator ───────────────────────────────────────────────────────
/**
 * Generates a unique URL-safe username from a first name.
 * Appends a random 5-char suffix and retries up to 10 times to avoid collisions.
 * Example: "raj" → "raj7k2m9"
 */
export async function generateUsername(firstName = "user") {
  const base = firstName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 12) || "user";

  for (let i = 0; i < 10; i++) {
    const suffix = Math.random().toString(36).slice(2, 7);
    const candidate = `${base}${suffix}`;
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  return `${base}${Date.now().toString(36)}`; // fallback
}

// Developed by Raj Dev (AstraToonix)

// ─── Relative Time Formatter ──────────────────────────────────────────────────
/**
 * Converts a Date to a human-readable relative string.
 * e.g.  "just now"  |  "5m ago"  |  "3h ago"
 */
export function formatRelativeTime(date) {
  const diff    = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours   = Math.floor(diff / 3_600_000);
  if (minutes < 1)  return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours   < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
}

// ─── String Truncator ─────────────────────────────────────────────────────────
/**
 * Truncates a string to `max` characters and appends "…" if needed.
 */
export function truncate(str = "", max = 120) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

// Developed by Raj Dev (AstraToonix)
