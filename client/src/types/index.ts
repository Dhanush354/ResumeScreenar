// Shared TypeScript interfaces matching backend models.

export type UserRole = 'candidate';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface InterviewQuestion {
  question: string;
  reason: string;
  expectedAnswerHint: string;
}

export type RoleFit = 'Excellent Fit' | 'Good Fit' | 'Average Fit' | 'Poor Fit' | string;

export type FinalRecommendation =
  | 'Strong Shortlist'
  | 'Shortlist with Improvements'
  | 'Needs Improvement'
  | 'Not Recommended'
  | string;

export interface ResumeAnalysis {
  _id: string;
  userId: string;
  candidateName: string;
  candidateEmail: string;
  resumeFileName: string;
  resumeText: string;
  jobTitle: string;
  companyName?: string;
  jobDescription: string;
  atsScore: number;
  overallMatchPercentage: number;
  roleFit: RoleFit;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedKeywords: string[];
  technicalSkillScore: number;
  experienceScore: number;
  projectScore: number;
  educationScore: number;
  keywordMatchScore: number;
  strengths: string[];
  weaknesses: string[];
  resumeImprovementSuggestions: string[];
  interviewQuestions: InterviewQuestion[];
  finalRecommendation: FinalRecommendation;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyzeResumePayload {
  resume: File;
  jobDescription: string;
  jobTitle: string;
  companyName?: string;
}

export interface ApiErrorResponse {
  message: string;
}
