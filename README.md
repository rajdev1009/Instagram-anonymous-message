# AnonMsg — Anonymous Messaging App
<!-- Developed by Raj Dev (AstraToonix) -->

## Environment Variables Setup

### 1. DATABASE_URL (Neon DB)
- neon.tech par jao
- New Project banao
- Dashboard mein "Connection String" copy karo
- Format aisa hoga:
  postgresql://user:pass@ep-abc.us-east-2.aws.neon.tech/neondb?sslmode=require

### 2. GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
- console.cloud.google.com par jao
- New Project → APIs & Services → Credentials
- OAuth 2.0 Client ID banao
- Authorized redirect URI add karo:
  http://localhost:3000/api/auth/callback/google

### 3. NEXTAUTH_SECRET
- Terminal mein yah command chalaao:
  openssl rand -base64 32
- Jo output aaye use paste karo

### 4. NEXTAUTH_URL
- Local: http://localhost:3000
- Production: https://tumhari-site.onrender.com

## .env.local file banao aur yah sab dalo:

DATABASE_URL="tumhara_neon_connection_string"
GOOGLE_CLIENT_ID="tumhara_google_client_id"
GOOGLE_CLIENT_SECRET="tumhara_google_secret"
NEXTAUTH_SECRET="openssl_se_generate_karo"
NEXTAUTH_URL="http://localhost:3000"

## Local Setup
npm install
npx prisma db push
npm run dev

## Deploy (Render/Koyeb)
Build: npm run build
Start: npm start

<!-- Developed by Raj Dev (AstraToonix) -->
