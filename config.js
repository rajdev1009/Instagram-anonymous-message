// Developed by Raj Dev (AstraToonix)

/**
 * FILE: config.js
 * PURPOSE: All project configuration files consolidated
 *
 * COPY EACH SECTION into the corresponding file in your Next.js project root:
 *
 * ┌─ SECTION 1  →  next.config.js
 * ├─ SECTION 2  →  tailwind.config.js
 * ├─ SECTION 3  →  postcss.config.js
 * ├─ SECTION 4  →  package.json
 * └─ SECTION 5  →  app/globals.css
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 ── next.config.js
// ═══════════════════════════════════════════════════════════════════════════════
/*
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};
module.exports = nextConfig;
*/

// Developed by Raj Dev (AstraToonix)

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 ── tailwind.config.js
// ═══════════════════════════════════════════════════════════════════════════════
/*
module.exports = {
  content: ["./app/**\/*.{js,jsx}", "./components/**\/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { purple: "#7c3aed", pink: "#ec4899", dark: "#0a0a0f", card: "#12121a" },
      },
      animation: {
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": { filter: "drop-shadow(0 0 6px #a855f7)", opacity: "1" },
          "50%":      { filter: "drop-shadow(0 0 18px #ec4899)", opacity: "0.75" },
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7c3aed, #ec4899)",
      },
    },
  },
  plugins: [],
};
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 ── postcss.config.js
// ═══════════════════════════════════════════════════════════════════════════════
/*
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 ── package.json
// ═══════════════════════════════════════════════════════════════════════════════
/*
{
  "name": "anon-msg-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev":         "next dev",
    "build":       "prisma generate && next build",
    "start":       "next start",
    "postinstall": "prisma generate",
    "db:push":     "prisma db push",
    "db:studio":   "prisma studio"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^1.6.0",
    "@prisma/client":       "^5.14.0",
    "framer-motion":        "^11.2.10",
    "next":                 "^14.2.4",
    "next-auth":            "^4.24.7",
    "react":                "^18.3.1",
    "react-dom":            "^18.3.1"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.19",
    "postcss":      "^8.4.38",
    "prisma":       "^5.14.0",
    "tailwindcss":  "^3.4.4"
  },
  "engines": { "node": ">=18.0.0" }
}
*/

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 ── app/globals.css
// ═══════════════════════════════════════════════════════════════════════════════
/*
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes glowPulse {
  0%, 100% { filter: drop-shadow(0 0 6px #a855f7) drop-shadow(0 0 12px #a855f7); opacity: 1; }
  50%       { filter: drop-shadow(0 0 18px #ec4899) drop-shadow(0 0 30px #ec4899); opacity: 0.75; }
}
.glow-pulse { animation: glowPulse 2s ease-in-out infinite; }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
.typewriter-cursor::after {
  content: "|";
  margin-left: 2px;
  animation: blink 1s ease-in-out infinite;
  color: #a855f7;
}

.glass {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
}

::-webkit-scrollbar       { width: 5px; }
::-webkit-scrollbar-track { background: #0a0a0f; }
::-webkit-scrollbar-thumb { background: #7c3aed; border-radius: 4px; }

body {
  background-color: #0a0a0f;
  color: #f1f1f1;
  font-family: 'Inter', system-ui, sans-serif;
}
*/

// Developed by Raj Dev (AstraToonix)
