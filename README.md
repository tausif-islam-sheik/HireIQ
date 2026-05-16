<div align="center">

# 🤖 HireIQ: Smart AI Recruitment Platform

**Revolutionizing the future of hiring with intelligent automation and data-driven insights.**

[![Next.js](https://img.shields.io/badge/NEXT.JS@16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT@5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/REACT@19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TanStack Query](https://img.shields.io/badge/TANSTACK%20QUERY-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/ZUSTAND-FF6B6B?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs)
[![Axios](https://img.shields.io/badge/AXIOS-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com)
[![shadcn/ui](https://img.shields.io/badge/SHADCN%2FUI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)

[Live Demo](https://hireiq-bay.vercel.app) · [Backend Repository](https://github.com/tausif-islam-sheik/HireIQ-Server) — Express.js REST API

</div>

---

## ✨ Project Vision

HireIQ is a next-generation recruitment ecosystem designed to eliminate the friction in modern hiring. By combining **Advanced AI (via OpenRouter)** with a **High-Performance UI**, we empower recruiters to find the perfect match in seconds while providing candidates with intelligent coaching to accelerate their careers.

### 🌟 Core Value Propositions

- **For Recruiters**: Automated resume screening, AI-ranked candidate lists, and comprehensive hiring analytics.
- **For Candidates**: Real-time resume quality analysis, AI-driven interview simulation, and hyper-personalized job matching.

---

## 🧠 Intelligence Engine (AI Features)

### 1. **Smart Resume Analysis** 📄

Candidates receive an instant, multi-dimensional audit of their professional profile.

- **Match Scoring**: Real-time percentage matching against specific job requirements.
- **Gap Identification**: AI pinpoints missing critical skills or experience.
- **Actionable Tips**: LLM-generated suggestions to improve resume visibility for ATS.

### 2. **AI Candidate Screening & Ranking** 🏆

Recruiters no longer need to manually filter through hundreds of applicants.

- **Automated Evaluation**: AI parses PDF/Word files and scores them based on job description context.
- **Ranked Pipelines**: Candidates are automatically sorted by "Job Fit," highlighting the "Top 3" instantly.

### 3. **AI Interview Coaching** 🎤

Immersive practice environment for candidates.

- **Dynamic Questioning**: Generates role-specific behavioral and technical questions.
- **Instant Feedback**: Scores responses on clarity, confidence, and technical accuracy.

### 4. **Predictive Job Recommendations** 🎯

A hybrid matching algorithm that suggests jobs based on skills, preferences, and platform-wide hiring trends.

---

## 🛠️ Technology Ecosystem

### Frontend Architecture

- **Framework**: Next.js 16 (App Router, Server Actions)
- **Styling**: Tailwind CSS & Vanilla CSS for premium micro-animations.
- **Components**: shadcn/ui & Radix UI (accessible, high-quality primitives).
- **State Management**: Zustand (Client) & TanStack Query (Server State).
- **Animations**: GSAP (Entrance/Scroll effects) & Lenis (Smooth Scrolling).

### Backend Powerhouse

- **Engine**: Express.js & Node.js 20+
- **ORM**: Prisma with PostgreSQL.
- **AI Integration**: OpenRouter API (Llama 3.1 / GPT-4o).
- **Real-time**: Socket.io for live AI processing notifications.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (Recommended)
- HireIQ Backend Server running

### Installation

```bash
# Clone the repository
git clone https://github.com/tausif-islam-sheik/HireIQ.git
cd HireIQ/hireiq

# Install dependencies
pnpm install

# Environment setup
cp .env.example .env.local
```

### Development

```bash
pnpm dev
# The platform will be live at http://localhost:3000
```

---

## 📂 Full Project Structure

```bash
hireiq/
├── public/                 # Static assets (images, icons, fonts)
├── src/
│   ├── app/                # Next.js 16 App Router
│   │   ├── (auth)/         # Auth routes (Login, Register, Forgot Password)
│   │   ├── (public)/       # Marketing & Public-facing pages
│   │   │   ├── about/      # Company information
│   │   │   ├── blog/       # Blog listing & AI articles
│   │   │   │   └── [id]/   # Dynamic blog detail pages
│   │   │   ├── contact/    # Contact & Support page
│   │   │   └── page.tsx    # Home landing page
│   │   ├── dashboard/      # Secure user dashboards
│   │   │   ├── admin/      # Platform administration & platform analytics
│   │   │   ├── candidate/  # Job seeker tools, applications, & AI prep
│   │   │   ├── recruiter/  # Job management & AI applicant screening
│   │   │   └── layout.tsx  # Dashboard navigation & layout logic
│   │   ├── api/            # Client-side API route handlers
│   │   ├── globals.css     # Global CSS & Tailwind configuration
│   │   ├── layout.tsx      # Root layout (Fonts, SEO, Lenis)
│   │   └── providers.tsx   # QueryClient, Auth, & SmoothScroll providers
│   ├── components/         # Reusable React components
│   │   ├── ai/             # AI-specific components (Score badges, Chat)
│   │   ├── dashboard/      # Dashboard widgets and navigation items
│   │   ├── forms/          # Form components (Job posting, Profile update)
│   │   ├── jobs/           # Job search, cards, and listing components
│   │   ├── layout/         # Shared Header, Footer, and Navbar
│   │   └── ui/             # shadcn/ui design system primitives
│   ├── hooks/              # Custom React hooks (useAuth, useGSAP, useLenis)
│   ├── lib/                # Utility functions, axios config, & blog data
│   ├── store/              # Zustand state management (Auth, UI, Filter)
│   ├── types/              # TypeScript interfaces and global types
│   └── middleware.ts       # Route protection & redirection logic
├── .env.local              # Local environment variables
├── next.config.ts          # Next.js configuration settings
├── package.json            # Project dependencies & scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS theme & plugin config
└── tsconfig.json           # TypeScript compiler configuration
```

---

**Built with AI 🤖 and using Next.js, TypeScript, and modern web technologies.**

## Screenshot

<img width="1920" height="8146" alt="HireIQ-AI-Powered-Smart-Recruitment-Platform-05-10-2026_06_23_PM" src="https://github.com/user-attachments/assets/4c6c702c-ab54-4e89-9dbc-6b498a1c70ef" />
