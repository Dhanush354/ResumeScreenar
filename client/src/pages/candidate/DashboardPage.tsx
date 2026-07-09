import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, TrendingUp, Award, History, ArrowRight, PlusCircle } from 'lucide-react';
import * as candidateService from '../../services/candidateService';
import type { ResumeAnalysis } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Badge from '../../components/common/Badge';
import { formatDate, getRoleFitClass, getScoreTextClass } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function loadAnalyses() {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await candidateService.getAnalyses();
      setAnalyses(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAnalyses();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  if (hasError) {
    return <ErrorState description="We couldn't load your analyses." onRetry={loadAnalyses} />;
  }

  const totalAnalyses = analyses.length;
  const averageAts = totalAnalyses
    ? Math.round(analyses.reduce((sum, a) => sum + a.atsScore, 0) / totalAnalyses)
    : 0;
  const highestMatch = totalAnalyses
    ? Math.round(Math.max(...analyses.map((a) => a.overallMatchPercentage)))
    : 0;
  const recentAnalyses = analyses.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-slate-500">Here's an overview of your resume analysis activity.</p>
      </div>

      {totalAnalyses === 0 ? (
        <Card>
          <EmptyState
            icon={FileSearch}
            title="No analyses yet"
            description="Upload your resume and a job description to get your first AI-powered match report."
            action={
              <Link to="/analyze">
                <Button size="lg">
                  <PlusCircle size={18} />
                  Analyze Your First Resume
                </Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <Card className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <FileSearch size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Analyses</p>
                <p className="text-2xl font-extrabold text-slate-900">{totalAnalyses}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Award size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Average ATS Score</p>
                <p className="text-2xl font-extrabold text-slate-900">{averageAts}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-accent-purple">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Highest Match %</p>
                <p className="text-2xl font-extrabold text-slate-900">{highestMatch}%</p>
              </div>
            </Card>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/analyze">
              <Button>
                <PlusCircle size={18} />
                Analyze Resume
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="outline">
                <History size={18} />
                View History
              </Button>
            </Link>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Recent Analyses</h2>
              <Link
                to="/history"
                className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                View all
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentAnalyses.map((analysis) => (
                <Link key={analysis._id} to={`/analysis/${analysis._id}`}>
                  <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-card">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 line-clamp-1">{analysis.jobTitle}</h3>
                        {analysis.companyName && (
                          <p className="text-sm text-slate-500 line-clamp-1">{analysis.companyName}</p>
                        )}
                      </div>
                      <Badge tone="neutral" className={getRoleFitClass(analysis.roleFit)}>
                        {analysis.roleFit}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-6">
                      <div>
                        <p className="text-xs text-slate-400">ATS Score</p>
                        <p className={`text-xl font-extrabold ${getScoreTextClass(analysis.atsScore)}`}>
                          {Math.round(analysis.atsScore)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Match</p>
                        <p
                          className={`text-xl font-extrabold ${getScoreTextClass(
                            analysis.overallMatchPercentage
                          )}`}
                        >
                          {Math.round(analysis.overallMatchPercentage)}%
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-slate-400">{formatDate(analysis.createdAt)}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
