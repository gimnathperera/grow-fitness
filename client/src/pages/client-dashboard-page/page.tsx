'use client';

import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import {
  OverviewTab,
  ScheduleTab,
  ProgressTab,
  AchievementsTab,
  MessagesTab,
} from './components';
import { useSelector } from 'react-redux';
import { selectAuth, selectSelectedKidId } from '@/auth/authSlice';
import { DashboardHeader } from '@/components/dashboard-header';
import { DesktopTabs } from '@/components/dashboard-tabs';
import { MobileTabNav } from '@/components/footer-tab-navbar';

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const auth = useSelector(selectAuth);
  const selectedKidId = useSelector(selectSelectedKidId);

  const tabsConfig = [
    { value: 'overview', component: <OverviewTab kidId={selectedKidId} /> },
    { value: 'achievements', component: <AchievementsTab kidId={selectedKidId} /> },
    { value: 'schedule', component: <ScheduleTab kidId={selectedKidId} /> },
    { value: 'progress', component: <ProgressTab kidId={selectedKidId} /> },
    { value: 'messages', component: <MessagesTab kidId={selectedKidId} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <DesktopTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={auth.user!}
        kidType="individual"
      >
        {tabsConfig.map(({ value, component }) => (
          <TabsContent key={value} value={value} className="space-y-6 pb-20 md:pb-6">
            {component}
          </TabsContent>
        ))}
      </DesktopTabs>

      <MobileTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={auth.user!}
        kidType="individual"
      />
    </div>
  );
}
