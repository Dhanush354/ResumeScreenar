import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/candidate/DashboardPage';
import AnalyzeResumePage from './pages/candidate/AnalyzeResumePage';
import AnalysisHistoryPage from './pages/candidate/AnalysisHistoryPage';
import AnalysisDetailsPage from './pages/candidate/AnalysisDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 500,
            },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <PublicLayout />
              </PublicOnlyRoute>
            }
          >
            <Route index element={<RegisterPage />} />
          </Route>

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <PublicLayout />
              </PublicOnlyRoute>
            }
          >
            <Route index element={<LoginPage />} />
          </Route>

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analyze" element={<AnalyzeResumePage />} />
            <Route path="/history" element={<AnalysisHistoryPage />} />
            <Route path="/analysis/:id" element={<AnalysisDetailsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
