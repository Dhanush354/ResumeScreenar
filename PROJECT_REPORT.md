# PROJECT REPORT

## CareerFit AI — AI-Powered Resume Screening and Job Match Analyzer

---

## 1. Abstract

CareerFit AI is a full-stack web application that uses generative AI to analyze how well a candidate's resume matches a specific job description. The system allows a candidate to register, upload a resume in PDF format, provide a target job title and job description, and receive an instant, structured analysis covering an ATS (Applicant Tracking System) compatibility score, an overall job-match percentage, a breakdown of scores across five dimensions (technical skills, experience, projects, education, and keyword match), matched and missing skills, resume improvement suggestions, and AI-generated interview questions tailored to the candidate's weak areas. The application is built with a React (TypeScript) frontend, a Node.js/Express backend, MongoDB for persistence, JWT for authentication, and Google's Gemini API for the AI analysis engine. The project demonstrates a complete, production-style MVP: real authentication, real file handling, real PDF text extraction, and real AI integration — with no mocked data.

## 2. Introduction

The modern job application process is increasingly automated. Most medium-to-large companies use an Applicant Tracking System to filter incoming resumes before a recruiter ever sees them. Candidates — especially students and recent graduates — often do not know why their resume is being rejected, because they have no visibility into how an ATS or a recruiter actually scores their resume against a job posting. CareerFit AI closes this feedback gap by giving candidates an AI-driven, recruiter-style evaluation of their resume against any job description they choose, along with concrete, actionable guidance on how to improve it.

## 3. Problem Statement

Job seekers frequently submit resumes that are technically qualified but are filtered out due to:
- Missing or mismatched keywords relative to the job description
- Poor alignment between resume content and role requirements
- Lack of awareness of which skills are missing for a target role
- No structured way to prepare for interviews based on their own resume's weak points

There is no easy, free, immediate way for a student or job seeker to get this feedback before submitting an application — existing solutions are either manual (career counseling, which doesn't scale) or generic keyword-matching tools with no real intelligence behind them.

## 4. Objectives

1. Build a working full-stack application that allows a candidate to register, log in, and manage their session securely.
2. Allow candidates to upload a real PDF resume and have its text extracted programmatically.
3. Integrate a large language model (Gemini API) to perform a genuine semantic comparison between a resume and a job description, not just keyword matching.
4. Produce a structured, quantifiable output: ATS score, match percentage, and a multi-dimensional score breakdown.
5. Surface actionable feedback: strengths, weaknesses, missing skills, and resume improvement suggestions.
6. Help candidates prepare for interviews by generating targeted interview questions based on gaps identified in their resume.
7. Persist every analysis so a candidate can review their history and track improvement over time.
8. Present all of this through a clean, modern, responsive dashboard UI.

## 5. Existing System

Prior to tools like this, candidates typically rely on:
- **Manual review**: asking peers, mentors, or career counselors to review a resume — slow, inconsistent, not scalable, and not tailored to a specific job description.
- **Generic ATS checkers**: simple keyword-density tools that count overlapping words between a resume and a job description, without understanding context, seniority, or relevance.
- **No feedback at all**: most candidates apply blindly and only learn a resume was rejected through silence or a generic rejection email, with no insight into why.

These approaches are either not scalable, not personalized, or not intelligent enough to give a candidate a genuine sense of how they'd be evaluated.

## 6. Proposed System

CareerFit AI proposes an automated, AI-driven pipeline:
1. A candidate account system (JWT-secured) so analyses are private and persisted per user.
2. Real PDF upload and text extraction, removing any manual copy-pasting of resume content.
3. A generative AI model (Gemini) prompted specifically to act as "an expert ATS resume analyzer and technical recruiter," producing a structured JSON evaluation rather than free-form text — making the output reliably renderable in a UI and comparable across analyses.
4. A dashboard and history system so the candidate can revisit past analyses, compare scores across different job applications, and iteratively improve their resume.

This system is faster, more consistent, and more specific to the actual job description than any manual or keyword-based alternative.

## 7. System Architecture

```
┌─────────────────┐        HTTPS/JSON, multipart          ┌──────────────────────┐
│   React Client   │  ───────────────────────────────────▶ │   Express API Server │
│ (Vite + TS +      │ ◀─────────────────────────────────── │  (Node.js)            │
│  Tailwind)         │        JSON responses                │                        │
└─────────────────┘                                        │  ┌──────────────────┐  │
                                                              │  │ Auth Middleware   │  │
        JWT stored in                                        │  │ (JWT verify)      │  │
        localStorage                                          │  └──────────────────┘  │
                                                              │  ┌──────────────────┐  │
                                                              │  │ Multer (PDF)      │  │
                                                              │  └──────────────────┘  │
                                                              │  ┌──────────────────┐  │
                                                              │  │ pdf-parse         │  │
                                                              │  └──────────────────┘  │
                                                              │           │            │
                                                              │           ▼            │
                                                              │  ┌──────────────────┐  │
                                                              │  │ aiService.js      │──┼──▶  Gemini API
                                                              │  │ (prompt + parse)  │  │
                                                              │  └──────────────────┘  │
                                                              │           │            │
                                                              │           ▼            │
                                                              │  ┌──────────────────┐  │
                                                              │  │ Mongoose Models   │──┼──▶  MongoDB
                                                              │  └──────────────────┘  │
                                                              └──────────────────────┘
```

**Request flow for analysis:**
Client (multipart form: PDF + job fields) → Auth middleware validates JWT → Upload middleware validates PDF type/size → Controller extracts text via `pdf-parse` → `aiService` builds the prompt and calls Gemini → Response is cleaned of markdown fences and JSON-parsed → Scores are validated/clamped → Result saved to MongoDB → Full analysis document returned to client → Client renders the report page.

## 8. Modules

1. **Authentication Module** — Registration, login, JWT issuance/verification, session persistence, protected routes.
2. **Resume Upload & Parsing Module** — Multer-based file validation, PDF text extraction.
3. **AI Analysis Module** — Prompt construction, Gemini API call, response cleaning/validation.
4. **Analysis Persistence Module** — MongoDB schema and CRUD operations for `ResumeAnalysis`.
5. **Candidate Dashboard Module** — Aggregate statistics (total analyses, average ATS score, best match).
6. **History Module** — List, view, and delete past analyses.
7. **Analysis Report Module** — Detailed visual breakdown of a single analysis (charts, badges, printable report).

## 9. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React (Vite) + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| HTTP client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Backend runtime | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| File upload | Multer |
| PDF parsing | pdf-parse |
| AI | Google Gemini API |
| Security/middleware | helmet, cors, express-rate-limit, morgan |

## 10. Database Design

### Collection: `users`
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, lowercase |
| password | String | required, bcrypt-hashed, not returned in queries by default |
| role | String | enum: `candidate` (default) |
| createdAt / updatedAt | Date | auto-managed timestamps |

### Collection: `resumeanalyses`
| Field | Type | Notes |
|---|---|---|
| userId | ObjectId | ref → `User`, required |
| candidateName, candidateEmail | String | extracted from resume text |
| resumeFileName, resumeText | String | original filename + extracted text |
| jobTitle, companyName, jobDescription | String | candidate input |
| atsScore, overallMatchPercentage | Number | 0–100 |
| roleFit | String | e.g. "Good Fit" |
| summary | String | AI-generated summary |
| matchedSkills, missingSkills, recommendedKeywords | [String] | |
| technicalSkillScore, experienceScore, projectScore, educationScore, keywordMatchScore | Number | 0–100 each |
| strengths, weaknesses, resumeImprovementSuggestions | [String] | |
| interviewQuestions | [{ question, reason, expectedAnswerHint }] | |
| finalRecommendation | String | e.g. "Strong Shortlist" |
| rawAIResponse | Object | full parsed AI response, kept for auditability |
| createdAt / updatedAt | Date | auto-managed timestamps |

One-to-many relationship: one `User` has many `ResumeAnalysis` documents, linked via `userId`.

## 11. API Design

### Auth
- `POST /api/auth/register` — `{ name, email, password }` → `201 { token, user }`
- `POST /api/auth/login` — `{ email, password }` → `200 { token, user }`
- `GET /api/auth/me` — (protected) → `200 { user }`

### Candidate
- `POST /api/candidate/analyze` — multipart (`resume` file, `jobDescription`, `jobTitle`, `companyName`) → `201 { analysis }`
- `GET /api/candidate/analyses` — `200 { analyses: [...] }`
- `GET /api/candidate/analyses/:id` — `200 { analysis }`
- `DELETE /api/candidate/analyses/:id` — `200 { message }`

All protected endpoints require `Authorization: Bearer <token>`. Standard status codes are used throughout: 200/201 for success, 400 for validation errors, 401 for authentication failures, 403 for forbidden access, 404 for missing resources, and 500 for unexpected server errors. A centralized Express error-handling middleware ensures no stack traces are leaked in production.

## 12. AI Workflow

1. **Input assembly** — resume text (extracted via `pdf-parse`), job description, and job title are collected server-side.
2. **Prompt construction** — a fixed, carefully engineered prompt instructs Gemini to act as "an expert ATS resume analyzer and technical recruiter" and to return **only valid JSON**, with an explicit schema for every field the UI needs (scores, skill lists, strengths/weaknesses, suggestions, interview questions, final recommendation).
3. **Model call** — the prompt is sent to the Gemini API using the API key supplied via `GEMINI_API_KEY` (never hardcoded, loaded only from environment variables).
4. **Response sanitization** — since LLMs sometimes wrap JSON in markdown code fences, the raw text response is stripped of any ` ```json ... ``` ` wrapping before parsing.
5. **Parsing & validation** — the cleaned text is parsed with `JSON.parse`. All numeric fields are clamped to the 0–100 range; all array/string fields default to safe empty values if the model omits them, so a slightly malformed AI response never crashes the app or corrupts the database.
6. **Failure handling** — if the Gemini call fails (network error, quota, invalid key) or the response cannot be parsed as JSON, the backend catches the error and returns a clean `500` JSON error to the client instead of crashing the server.
7. **Persistence** — the validated result, together with the original raw AI response (for auditability/debugging), is saved as a `ResumeAnalysis` document.

## 13. Testing

- **Manual functional testing**: registration/login flows (valid and invalid credentials), protected route access without a token, resume upload with valid/invalid file types and oversized files, full analyze → view → delete lifecycle.
- **API testing**: each route tested independently (e.g. via REST client) for correct status codes and response shapes, including error paths (missing fields, invalid IDs, analyses belonging to another user).
- **AI response resilience testing**: verified the backend does not crash when Gemini returns markdown-wrapped JSON, partially malformed JSON, or missing fields — clamping/defaulting logic was exercised with deliberately incomplete mock responses during development.
- **Frontend testing**: TypeScript strict-mode compilation with zero errors, manual UI walkthroughs of every page (landing → register → login → dashboard → analyze → history → details) across loading, empty, error, and success states, and responsive layout checks at mobile/tablet/desktop breakpoints.

## 14. Results

The completed MVP delivers a fully functional candidate-facing workflow: a user can register, securely log in, upload a real resume PDF, submit a job description, and receive a genuine AI-generated evaluation within seconds — persisted to MongoDB and viewable at any time from a history page. The analysis output is consistently structured (thanks to strict JSON-schema prompting and server-side validation), enabling rich, chart-based visualization on the frontend (score breakdown bar charts, circular ATS/match indicators, skill chips, and interview-question cards). The system handles error conditions gracefully — invalid files, AI/network failures, and unauthorized access all return clean, user-facing error messages rather than crashes.

## 15. Future Scope

- Introduce Recruiter and Admin roles: job postings, applicant ranking, bulk resume screening.
- Support additional resume formats (DOCX, plain text).
- Allow a single job description to be matched against multiple resumes for comparison.
- Track score trends over time with historical charts as a candidate iterates on their resume.
- Generate a polished, server-rendered PDF report instead of relying on browser print.
- Add email notifications for analysis completion and periodic improvement reminders.
- Fine-tune or few-shot the AI prompt further using real anonymized recruiter feedback to improve scoring accuracy.

## 16. Conclusion

CareerFit AI demonstrates how generative AI can be applied practically to solve a real, everyday problem faced by job seekers: not knowing how their resume stacks up against a specific job before they apply. By combining secure authentication, real PDF processing, and a tightly-scoped, schema-constrained AI integration, the project delivers a genuinely useful MVP rather than a superficial demo — while remaining a clean, understandable codebase suitable for an academic final-year project and a strong portfolio piece.
