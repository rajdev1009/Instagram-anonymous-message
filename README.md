# AnonMsg — Anonymous Messaging App
<!-- Developed by Raj Dev (AstraToonix) -->

## App Logic
- Google login required for all pages
- User gets unique link: /u/username
- Messages expire after 24 hours
- Secret decode password: astratoonix143

## Setup
```bash
npm install
cp .env.example .env.local
# Fill in .env.local values
npx prisma db push
npm run dev
```

## Deploy
- Build: `npm run build`
- Start: `npm start`

<!-- Developed by Raj Dev (AstraToonix) -->
