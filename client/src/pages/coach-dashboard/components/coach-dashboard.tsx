'use client';

import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard-header';
import { DesktopTabs } from '@/components/dashboard-tabs';
import { MobileTabNav } from '@/components/footer-tab-navbar';
import { OverviewTab } from '@/pages/coach-dashboard/components/overview-tab';
import StudentsTab from './students-tab';
import ScheduleTab from './schedule-tab';
import { sessions, students } from '@/data/coach/coach-dashboard';
import type { User } from '@/types/dashboard';

const user: User = { name: 'Sarah Johnson', role: 'coach' };

const tabsConfig = [
  { value: 'overview', component: <OverviewTab user={user} sessions={sessions} /> },
  { value: 'students', component: <StudentsTab students={students} /> },
  { value: 'schedule', component: <ScheduleTab /> },
];

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <DesktopTabs activeTab={activeTab} onTabChange={setActiveTab} user={user}>
        <Tabs value={activeTab}>
          {tabsConfig.map(({ value, component }) => (
            <TabsContent
              key={value}
              value={value}
              className="space-y-6 pb-20 md:pb-6"
            >
              {component}
            </TabsContent>
          ))}
        </Tabs>
      </DesktopTabs>

      <MobileTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
      />
    </div>
  );
}
