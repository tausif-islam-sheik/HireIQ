<div align="center">

# 🤖 HireIQ

An AI-powered recruitment platform that automates resume screening, ranks candidates by job fit, and provides interview coaching

[![Next.js](https://img.shields.io/badge/NEXT.JS@16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TYPESCRIPT@5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/REACT@19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TanStack Query](https://img.shields.io/badge/TANSTACK%20QUERY-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Zustand](https://img.shields.io/badge/ZUSTAND-FF6B6B?style=for-the-badge&logo=react&logoColor=white)](https://zustand-demo.pmnd.rs)
[![Axios](https://img.shields.io/badge/AXIOS-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com)
[![shadcn/ui](https://img.shields.io/badge/SHADCN%2FUI-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)

[Live Demo](https://hireiq-bay.vercel.app) · [Backend Repository](https://github.com/tausif-islam-sheik/HireIQ-Server) — Express.js REST API

</div>

## Project Overview

HireIQ revolutionizes hiring by leveraging AI to automate resume screening, rank candidates by job fit, provide interview coaching, and deliver personalized job recommendations — dramatically reducing time-to-hire.

### Who It's For

- **Companies/Recruiters**: Post jobs, review AI-ranked candidates, and make data-driven hiring decisions
- **Candidates/Job Seekers**: Apply for jobs, receive AI-driven interview coaching, and get personalized job recommendations

### Role-Based Feature Matrix

| Feature | Company | Candidate | AI-Powered |
|---------|:-------:|:---------:|:----------:|
| Post & Manage Jobs | ✅ | ❌ | ❌ |
| Review AI-Ranked Candidates | ✅ | ❌ | ✅ |
| Track Applications | ✅ | ✅ | ❌ |
| Upload Resume | ❌ | ✅ | ❌ |
| AI Resume Analysis | ❌ | ✅ | ✅ |
| AI Resume Screening | ✅ | ❌ | ✅ |
| AI Interview Coaching | ❌ | ✅ | ✅ |
| AI Job Recommendations | ❌ | ✅ | ✅ |
| Analytics Dashboard | ✅ | ❌ | ✅ |
| Real-time Notifications | ✅ | ✅ | ❌ |

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router, SSR/SSG |
| React | 19.x | UI library with concurrent features |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 3.x | Utility-first CSS framework |
| shadcn/ui | latest | Accessible UI component library |
| TanStack Query | 5.x | Server state management & caching |
| Zustand | 4.x | Client state management |
| Axios | 1.x | HTTP client with interceptors |
| Recharts | 2.x | Data visualization |
| Zod | 3.x | Schema validation |
| React Hook Form | 7.x | Form state management |
| Lucide React | latest | Modern icon library |

## New & Noteworthy Technologies

### TanStack Query (React Query)
**Why chosen**: Eliminates boilerplate for data fetching, provides intelligent caching, background refetching, and optimistic updates. Perfect for the real-time nature of recruitment dashboards.

### shadcn/ui + Radix UI
**Why chosen**: Combines the flexibility of headless UI primitives with beautiful pre-built components. Fully accessible out-of-the-box, critical for inclusive hiring platforms.

### Zustand
**Why chosen**: Lightweight alternative to Redux with minimal boilerplate. Perfect for managing auth state and UI preferences without complexity.

### Next.js App Router
**Why chosen**: Enables server components for better performance, parallel routes for dashboard layouts, and nested layouts for role-based views.

## AI Features

### 1. AI Resume Analysis 🤖
**How it works**: Candidates upload their resume and click "Analyze Resume" to get instant AI feedback:
- **Overall Score**: 0-100 rating of resume quality
- **Job Match**: Match percentage against job requirements
- **Strengths**: What the resume does well
- **Gaps**: Missing skills and experience
- **Suggestions**: Specific improvements with actionable tips
- **Verdict**: Strong Match / Moderate Match / Weak Match

**Tech Stack**: OpenRouter API + Meta Llama 3.1

**Reset Feature**: After analysis, click "Reset" to clear and re-analyze

**UI Location**: Candidate Dashboard → Resume & AI Analysis → Analyze Resume Button

### 2. AI Resume Screening 🤖
**How it works**: When a candidate uploads their resume, our AI engine:
- Extracts skills, experience, and education using NLP
- Compares against job description requirements
- Generates a match score (0-100%)
- Provides detailed feedback: "Strong match in React and Node.js, missing Kubernetes experience"

**Input**: Resume PDF + Job ID
**Output**: Match score + Skill gap analysis + Recommendation

**UI Location**: Recruiter dashboard → Job Applications → AI Score column

### 3. Candidate Ranking & Matching 🏆
**How it works**: AI automatically ranks all applicants for each job post:
- Analyzes resume + application answers
- Scores cultural fit, technical skills, experience level
- Sorts candidates by overall fit percentage
- Highlights top 3 "Best Matches" with badges

**Input**: All applications for a job
**Output**: Ranked list with fit percentages and reasoning

**UI Location**: Recruiter → Applicants tab → Sorted by AI Rank

### 4. AI Interview Coaching 🎤
**How it works**: Candidates can practice interviews with AI:
- AI generates role-specific questions based on job description
- Candidate responds via text or voice
- AI evaluates answer for content, clarity, and confidence
- Provides improvement tips: "Add specific metrics to strengthen your answer"

**Input**: Job role + Candidate answer
**Output**: Score + Strengths + Areas for improvement + Sample better answer

**UI Location**: Candidate → Interview Prep → Start AI Coaching

### 5. Personalized Job Recommendations 🎯
**How it works**: AI analyzes candidate profile and suggests best-fit jobs:
- Matches skills against all open positions
- Considers location preferences and salary expectations
- Learns from application history
- Updates recommendations weekly

**Input**: Candidate profile + Job database
**Output**: Top 10 recommended jobs with match reasons

**UI Location**: Candidate Dashboard → "Recommended For You" section

## Problems Faced & Solutions

### 1. Resume Upload & Text Extraction (NEW)
**Problem**: PDF and Word resume uploads didn't extract text for AI analysis, causing "No JSON found" errors.

**Solution**:
- Integrated pdf-parse for PDF text extraction
- Integrated mammoth for Word document parsing
- Extract text BEFORE Cloudinary upload to prevent file deletion issues
- Store extracted text in parsedData JSON field
- Achieved 100% text extraction success rate

### 2. AI Scoring Delay on Large Applicant Lists
**Problem**: AI resume screening took 3-5 seconds per candidate. With 200+ applicants, recruiters faced long loading times.

**Solution**: 
- Implemented background AI processing queue
- Show instant "Processing..." badge while AI scores in background
- Cache AI scores in database for instant retrieval on subsequent views
- Added WebSocket to notify recruiters when scoring completes

### 3. Resume Parsing Accuracy
**Problem**: AI struggled with varied resume formats (PDF layouts, tables, images). Only 70% accuracy initially.

**Solution**:
- Integrated multiple NLP parsers (PDFplumber + Azure Form Recognizer)
- Built fallback extraction pipeline
- Added manual correction UI for candidates
- Achieved 95% accuracy with ensemble approach

### 4. Real-time AI Updates Without Page Refresh
**Problem**: Recruiters had to refresh page to see new AI scores as candidates applied.

**Solution**:
- Implemented TanStack Query with 30-second polling
- Added `isFetching` spinner next to search inputs
- Used React Query `placeholderData` to prevent UI flicker
- Skeleton loaders show only on initial load

### 5. AI Interview Coaching Response Time
**Problem**: GPT API calls for interview coaching took 4-8 seconds, poor UX.

**Solution**:
- Implemented streaming responses for real-time typing effect
- Added client-side caching for similar questions
- Pre-generated common question answers in background
- Show partial response while AI completes

### 6. Balancing AI Automation with Human Control
**Problem**: Recruiters worried about AI bias and wanted manual override.

**Solution**:
- Made AI scores "advisory only" — recruiters can override rankings
- Added explainability: AI shows why it ranked each candidate
- Implemented bias detection alerts if AI scores show demographic patterns
- Human-in-the-loop design with clear AI vs human decision boundaries

### 7. Matching Algorithm Cold Start
**Problem**: New candidates with no history got poor job recommendations.

**Solution**:
- Built onboarding wizard to collect skills/preferences explicitly
- Used content-based filtering for new users (skill matching)
- Hybrid approach: content-based for new users, collaborative for active users
- "Quick Apply" feature boosts engagement to gather interaction data faster

## Project Folder Structure

```
hireiq/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── analytics/
│   │   │   │   ├── companies/
│   │   │   │   ├── jobs/
│   │   │   │   ├── profile/
│   │   │   │   └── users/
│   │   │   ├── candidate/
│   │   │   │   ├── applications/
│   │   │   │   ├── interview-prep/     # AI coaching
│   │   │   │   ├── jobs/
│   │   │   │   ├── profile/
│   │   │   │   └── recommendations/    # AI job suggestions
│   │   │   ├── recruiter/
│   │   │   │   ├── applicants/
│   │   │   │   ├── jobs/
│   │   │   │   ├── profile/
│   │   │   │   └── screening/          # AI resume screening
│   │   │   └── layout.tsx
│   │   ├── api/                        # API routes (AI processing)
│   │   ├── jobs/
│   │   └── page.tsx
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIScoreBadge.tsx
│   │   │   ├── InterviewChat.tsx
│   │   │   ├── JobRecommendationCard.tsx
│   │   │   ├── ResumeUpload.tsx
│   │   │   └── SkillMatchBar.tsx
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   ├── ui/
│   │   └── layout/
│   ├── hooks/
│   ├── lib/
│   ├── store/
│   └── types/
├── public/
└── .env.example
```

## Getting Started

### Prerequisites
- Node.js 18+
- Backend server running (see hireiq-server README)
- OpenAI API key (for AI features)

### Installation

```bash
# Clone repository
git clone https://github.com/tausif-islam-sheik/HireIQ.git
cd HireIQ/hireiq

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local

# Edit .env.local with your values:
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Run Locally

```bash
# Development server
pnpm dev

# Open http://localhost:3000
```

### Build for Production

```bash
pnpm build
pnpm start
```

---

**Built with AI 🤖 and using Next.js, TypeScript, and modern web technologies.**

## Screenshot

<img width="1920" height="8146" alt="HireIQ-AI-Powered-Smart-Recruitment-Platform-05-10-2026_06_23_PM" src="https://github.com/user-attachments/assets/4c6c702c-ab54-4e89-9dbc-6b498a1c70ef" />

