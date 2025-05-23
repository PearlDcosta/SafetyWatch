# SafetyWatch: Crime Reporting & Tracking Platform

SafetyWatch is a modern, full-stack web application for reporting, tracking, and managing crime incidents. Built with Next.js, Firebase, and Tailwind CSS, it provides a secure, user-friendly experience for citizens and administrators.

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Features
- **Anonymous & Authenticated Reporting**: Submit crime reports with or without an account.
- **Real-Time Tracking**: Track report status using a unique tracking ID.
- **Admin Dashboard**: Review, verify, and manage reports with advanced filtering and sorting.
- **Interactive Map**: Visualize crime locations and heatmaps.
- **Image Upload & AI Extraction**: Attach evidence and auto-extract details from images (Gemini AI, OCR).
- **Modern UI/UX**: Responsive, accessible, and visually polished interface.

---

## 📦 Tech Stack
- **Framework**: [Next.js](https://nextjs.org)
- **Database & Auth**: [Firebase](https://firebase.google.com)
- **UI**: [Tailwind CSS](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com/)
- **Maps**: [Leaflet.js](https://leafletjs.com/)
- **AI/ML**: Google Gemini, OCR.space
- **State Management**: React Context

---

## 📁 Project Structure
- `src/app/` — Main app routes (dashboard, reports, admin, etc.)
- `src/components/` — Reusable UI and feature components
- `src/lib/` — Utilities, API, and data logic
- `src/types/` — TypeScript types
- `public/` — Static assets (map icons, images)

---

## 🔒 Environment Variables
Create a `.env.local` file for your Firebase and API keys:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_OCR_SPACE_API_KEY=...
```

---

## 📝 Customization & Deployment
- **Styling**: Tailwind config in `tailwind.config.js`, PostCSS in `postcss.config.mjs`.
- **Build**: `npm run build` and `npm start` for production.
- **Deploy**: Easily deploy to [Vercel](https://vercel.com/) or any Node.js host.

---

## 📚 Learn More
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)

---

## 👤 Author & License
- Built by Pearl Arun Dcosta
- MIT License
