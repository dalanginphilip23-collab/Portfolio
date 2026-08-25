<div align="center">
<img width="1200" height="475" alt="Portfolio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# John Philip Dalangin — Frontend Developer Portfolio

Modern React + Vite + Tailwind CSS portfolio with AI assistant (Gemini), project showcase, and animated resume.

## Tech Stack
- **React 19** + **Vite 6**
- **Tailwind CSS 4** (`@tailwindcss/vite`)
- **TypeScript**
- **Gemini AI** (`@google/genai`)
- **html2pdf.js** (lazy-loaded)

## Project Structure
```
Portfolio/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Local images/fonts
│   ├── components/
│   │   ├── features/       # AIAssistant
│   │   ├── layout/         # Navbar, Footer
│   │   ├── modals/         # ResumeModal, ProjectDetailModal
│   │   ├── sections/       # Hero, About, Projects, Contact
│   │   └── ui/             # ScrollReveal, ScrollToTop
│   ├── pages/              # Home
│   ├── services/           # geminiService
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css           # Tailwind + animations
│   ├── constants.tsx       # Data (projects, resume)
│   └── types.ts
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

**Prerequisites:** Node.js 18+

1. Install:
   ```bash
   npm install
   ```
2. Env — copy `.env.example` to `.env.local` and add your Gemini key:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
   Get a key at https://aistudio.google.com/app/apikey

3. Dev:
   ```bash
   npm run dev      # http://localhost:3000
   ```
4. Build:
   ```bash
   npm run build
   npm run preview
   ```

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview build

## Features
- Dark/light theme, parallax hero, scroll reveal, project filtering, PDF resume generation.
