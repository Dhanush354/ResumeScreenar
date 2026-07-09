import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  XCircle,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  MessageCircleQuestion,
  ChevronDown,
} from 'lucide-react';
import * as candidateService from '../../services/candidateService';
import type { ResumeAnalysis } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/common/Badge';
import ScoreCircle from '../../components/common/ScoreCircle';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import {
  formatDateTime,
  getRoleFitClass,
  getRecommendationClass,
  getScoreColor,
} from '../../utils/helpers';

function InterviewQuestionCard({
  question,
  reason,
  expectedAnswerHint,
  index,
}: {
  question: string;
  reason: string;
  expectedAnswerHint: string;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-slate-800">{question}</span>
        </div>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="space-y-3 border-t border-slate-100 bg-slate-50 px-5 py-4 print:block">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Why it's asked</p>
            <p className="mt-1 text-sm text-slate-600">{reason}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Expected answer hint
            </p>
            <p className="mt-1 text-sm text-slate-600">{expectedAnswerHint}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalysisDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function loadAnalysis() {
    if (!id) return;
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await candidateService.getAnalysisById(id);
      setAnalysis(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner message="Loading analysis..." />;
  }

  if (hasError || !analysis) {
    return (
      <ErrorState
        title="Analysis not found"
        description="This analysis may have been deleted or the link is invalid."
        onRetry={loadAnalysis}
      />
    );
  }

  const scoreBreakdown = [
    { name: 'Technical Skills', score: analysis.technicalSkillScore },
    { name: 'Experience', score: analysis.experienceScore },
    { name: 'Projects', score: analysis.projectScore },
    { name: 'Education', score: analysis.educationScore },
    { name: 'Keyword Match', score: analysis.keywordMatchScore },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in print:max-w-full">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <Link
            to="/history"
            className="mb-2 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-primary-600"
          >
            <ArrowLeft size={14} />
            Back to History
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">{analysis.jobTitle}</h1>
          <p className="text-sm text-slate-500">
            {analysis.companyName ? `${analysis.companyName} · ` : ''}
            {formatDateTime(analysis.createdAt)}
          </p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer size={16} />
          Print / Download Report
        </Button>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block">
        <h1 className="text-2xl font-extrabold text-slate-900">CareerFit AI — Resume Analysis Report</h1>
        <p className="text-sm text-slate-500">
          {analysis.jobTitle}
          {analysis.companyName ? ` · ${analysis.companyName}` : ''} · {formatDateTime(analysis.createdAt)}
        </p>
        <p className="text-sm text-slate-500">
          Candidate: {analysis.candidateName} ({analysis.candidateEmail})
        </p>
      </div>

      {/* Scores overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 print:grid-cols-3">
        <Card className="flex flex-col items-center">
          <ScoreCircle score={analysis.atsScore} label="ATS Score" size={150} />
        </Card>
        <Card className="flex flex-col items-center">
          <ScoreCircle score={analysis.overallMatchPercentage} label="Overall Match %" size={150} />
        </Card>
        <Card className="flex flex-col items-center justify-center gap-3">
          <p className="text-sm font-semibold text-slate-500">Role Fit</p>
          <Badge className={`text-base px-4 py-1.5 ${getRoleFitClass(analysis.roleFit)}`}>
            {analysis.roleFit}
          </Badge>
        </Card>
      </div>

      {/* Final recommendation */}
      <Card className={`border-2 ${getRecommendationClass(analysis.finalRecommendation).split(' ').filter(c => c.startsWith('border')).join(' ')}`}>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Final Recommendation</p>
        <div className="mt-2">
          <Badge className={`text-base px-4 py-1.5 ${getRecommendationClass(analysis.finalRecommendation)}`}>
            {analysis.finalRecommendation}
          </Badge>
        </div>
      </Card>

      {/* Summary */}
      <Card>
        <h2 className="text-lg font-bold text-slate-900">Summary</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{analysis.summary}</p>
      </Card>

      {/* Score breakdown chart */}
      <Card>
        <h2 className="text-lg font-bold text-slate-900">Score Breakdown</h2>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={scoreBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#64748b' }}
                interval={0}
                angle={-15}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                cursor={{ fill: '#f1f5f9' }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {scoreBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Skills */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 print:grid-cols-3">
        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Matched Skills
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.matchedSkills.length ? (
              analysis.matchedSkills.map((skill) => (
                <Badge key={skill} tone="success">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400">No matched skills found.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <XCircle size={18} className="text-amber-500" />
            Missing Skills
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.missingSkills.length ? (
              analysis.missingSkills.map((skill) => (
                <Badge key={skill} tone="warning">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400">No missing skills — great job!</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Tag size={18} className="text-primary-500" />
            Recommended Keywords
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.recommendedKeywords.length ? (
              analysis.recommendedKeywords.map((keyword) => (
                <Badge key={keyword} tone="primary">
                  {keyword}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400">No recommended keywords.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ThumbsUp size={18} className="text-emerald-500" />
            Strengths
          </h2>
          <ul className="mt-3 space-y-2">
            {analysis.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <ThumbsDown size={18} className="text-red-500" />
            Weaknesses
          </h2>
          <ul className="mt-3 space-y-2">
            {analysis.weaknesses.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Improvement suggestions */}
      <Card>
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <Lightbulb size={18} className="text-purple-500" />
          Resume Improvement Suggestions
        </h2>
        <ul className="mt-3 space-y-2">
          {analysis.resumeImprovementSuggestions.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-purple" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* Interview questions */}
      <Card>
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <MessageCircleQuestion size={18} className="text-primary-500" />
          Interview Questions
        </h2>
        <div className="mt-4 space-y-3">
          {analysis.interviewQuestions.map((q, i) => (
            <InterviewQuestionCard
              key={i}
              index={i}
              question={q.question}
              reason={q.reason}
              expectedAnswerHint={q.expectedAnswerHint}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
