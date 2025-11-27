import type React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages';
import ProfilePage from '@/pages/profile/components/profile-page';
import RootLayout from '@/layouts/root-layout';
import LoginPage from '@/pages/sign-in-page';
import CoachPage from '@/pages/coach-dashboard/page';
import ParentDashboard from '@/pages/client-dashboard-page/page';
import { RequireAuth } from '@/auth/RequireAuth';
import { RequireGuest } from '@/auth/RequireGuest';
import { SignUpPage } from '@/pages/sign-up-page/index';
import AddKidsDetailsPage from '@/pages/sign-up-page/components/kids-details';
import ClientDashboard from '@/pages/client-dashboard-page/page';
import ForgotPasswordPage from '@/pages/forgot-password';
import CoachBadges from '@/pages/coach-dashboard/components/kids-progress';
import CollectInfoPage from '@/pages/collect-info-page';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="add-kids-details"
            element={
              <RequireGuest>
                <AddKidsDetailsPage />
              </RequireGuest>
            }
          />
          <Route
            path="client-dashboard"
            element={
              <RequireAuth requiredRoles={['client', 'parent', 'team', 'admin']}>
                <ClientDashboard />
              </RequireAuth>
            }
          />
          <Route
            path="sign-in"
            element={
              <RequireGuest>
                <LoginPage />
              </RequireGuest>
            }
          />
          <Route
            path="coach-dashboard"
            element={
              <RequireAuth requiredRoles="coach">
                <CoachPage />
              </RequireAuth>
            }
          />
          <Route
            path="parent-dashboard"
            element={
              <RequireAuth requiredRoles="client">
                <ParentDashboard />
              </RequireAuth>
            }
          />
          <Route path="add-kids-details" element={<AddKidsDetailsPage />} />
          <Route path="client-dashboard" element={<ClientDashboard />} />
          <Route path="coach-dashboard" element={<CoachPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="collect-info" element={<CollectInfoPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="kids-progress" element={<CoachBadges />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
