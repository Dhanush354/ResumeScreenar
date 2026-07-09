# CareerFit AI

**AI-Powered Resume Screening and Job Match Analyzer**

CareerFit AI is a full-stack MVP web application that helps job seekers understand how well their resume matches a target job description. Candidates upload a PDF resume, paste a job description, and receive an AI-generated ATS score, match percentage, skill-gap analysis, resume improvement suggestions, and mock interview questions — powered by Google's Gemini API.

Built as a final-year CSE academic project, but engineered like a real production MVP: real authentication, a real database, real PDF parsing, and real AI analysis (no mock data anywhere).

---

## 1. Project Overview

Recruiters and Applicant Tracking Systems (ATS) reject a large percentage of resumes before a human ever reads them — usually because of missing keywords, poor formatting, or weak alignment with the job description. CareerFit AI gives candidates the same lens an ATS/recruiter would use, so they can fix their resume *before* applying.

The candidate flow is simple:

1. Register / Login
2. Upload a resume (PDF) + paste a job description + enter a target role
3. Get an instant AI analysis: ATS score, match %, skill gaps, strengths/weaknesses, improvement tips, and interview questions
4. Review past analyses anytime from a history page

## 2. Features

- Secure JWT-based authentication (register, login, persistent session)
- Real PDF resume upload with server-side validation (type, size)
- Real text extraction from PDF resumes using `pdf-parse`
- AI-powered resume-vs-job-description analysis using the Gemini API
- ATS score, overall match percentage, and a 5-part score breakdown (technical skill, experience, project, education, keyword match)
- Matched skills, missing skills, and recommended keywords
- Strengths, weaknesses, and resume improvement suggestions
- AI-generated interview questions with reasoning and answer hints
- Candidate dashboard with aggregate stats (total analyses, average ATS score, best match)
- Full analysis history with view/delete
- Detailed analysis report page with charts, badges, and a print/download report button
- Modern, responsive, professional UI (Tailwind CSS)

## 3. Tech Stack

**Frontend:** React (Vite) + TypeScript, Tailwind CSS, React Router DOM, Axios, Recharts, Lucide React, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs, Multer, pdf-parse, dotenv, cors, helmet, express-rate-limit, morgan

**AI:** Google Gemini API

## 4. Folder Structure

```txt
ResumeScreenar/
│
├── client/                     # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # LoadingSpinner, EmptyState, ErrorState, ScoreCircle, Badge
│   │   │   ├── layout/         # Navbar, Sidebar, DashboardLayout, PublicLayout
│   │   │   └── ui/             # Button, Card, Input, Textarea
│   │   ├── context/            # AuthContext
│   │   ├── pages/
│   │   │   ├── auth/           # LoginPage, RegisterPage
│   │   │   ├── candidate/      # DashboardPage, AnalyzeResumePage, AnalysisHistoryPage, AnalysisDetailsPage
│   │   │   └── public/         # LandingPage
│   │   ├── services/           # api.ts, authService.ts, candidateService.ts
│   │   ├── types/              # shared TypeScript interfaces
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
├── server/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/             # MongoDB connection
│   │   ├── controllers/        # authController, candidateController
│   │   ├── middleware/         # authMiddleware, errorMiddleware, uploadMiddleware
│   │   ├── models/              # User, ResumeAnalysis
│   │   ├── routes/              # authRoutes, candidateRoutes
│   │   ├── services/            # aiService.js (Gemini integration)
│   │   ├── utils/
│   │   └── server.js
│   ├── uploads/
│   ├── package.json
│   └── .env.example
│
├── README.md
└── PROJECT_REPORT.md
```

## 5. Environment Variables

### server/.env
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### client/.env
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> The Gemini API key is **never** hardcoded anywhere in the codebase — it is read only from `process.env.GEMINI_API_KEY` on the server. Copy each `.env.example` to `.env` and fill in your own values before running the project.

## 6. Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- A MongoDB connection string (local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A [Gemini API key](https://ai.google.dev/) (free tier available from Google AI Studio)

### Backend
```bash
cd server
npm install
copy .env.example .env      # then fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY
npm run dev
```
The API runs at `http://localhost:5000`.

### Frontend
```bash
cd client
npm install
copy .env.example .env      # defaults to http://localhost:5000/api, adjust if needed
npm run dev
```
The app runs at `http://localhost:5173`.

Open `http://localhost:5173` in your browser, register a candidate account, and start analyzing resumes.

## 7. API Routes

### Auth
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new candidate | Public |
| POST | `/api/auth/login` | Login and receive a JWT | Public |
| GET | `/api/auth/me` | Get the current logged-in user | Protected |

### Candidate
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/api/candidate/analyze` | Upload resume PDF + job description → AI analysis | Protected |
| GET | `/api/candidate/analyses` | List all past analyses for the current user | Protected |
| GET | `/api/candidate/analyses/:id` | Get one analysis in full detail | Protected |
| DELETE | `/api/candidate/analyses/:id` | Delete an analysis | Protected |

All protected routes require an `Authorization: Bearer <token>` header.

## 8. How AI Analysis Works

1. The candidate uploads a resume PDF and submits a job title + job description.
2. The backend validates the file (must be a PDF, ≤ 5MB) and the required text fields.
3. `pdf-parse` extracts raw text from the PDF.
4. A regex extracts the candidate's email from the resume text; the first non-empty line(s) are used to approximate the candidate's name.
5. The resume text, job description, and job title are sent to the Gemini API using a strict prompt that instructs the model to return **only valid JSON** matching the `ResumeAnalysis` schema (ATS score, match %, score breakdown, matched/missing skills, strengths/weaknesses, improvement suggestions, interview questions, final recommendation).
6. The backend strips any markdown code-fences Gemini might add, parses the JSON, clamps all scores to a 0–100 range, and defaults any missing fields so a malformed AI response never crashes the app.
7. The full result is saved to MongoDB as a `ResumeAnalysis` document linked to the user, and returned to the frontend for immediate display.
8. If Gemini fails or returns unparseable JSON, the backend returns a clean error response instead of crashing.

## 9. Future Enhancements

- Recruiter and Admin roles (job posting, candidate ranking, applicant pipelines)
- Resume builder / auto-rewrite suggestions applied directly to the PDF
- Support for DOCX resumes in addition to PDF
- Multi-resume comparison against a single job description
- Analytics over time (score trend charts across multiple analyses)
- Email notifications / weekly progress digests
- Export analysis report as a styled PDF (server-generated) instead of browser print
- Team/organization accounts for career centers and bootcamps

## Resume Bullets (for your own resume/portfolio)

```txt
- Developed an AI-powered resume screening and job match platform using React, Node.js, MongoDB, and Gemini API.
- Implemented PDF parsing, ATS scoring, job description matching, skill gap detection, and AI-generated interview preparation.
- Designed a responsive candidate dashboard with score analytics, analysis history, and downloadable reports.
```
