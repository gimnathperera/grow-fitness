import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard-header';
import { DesktopTabs } from '@/components/dashboard-tabs';
import { MobileTabNav } from '@/components/footer-tab-navbar';
import {
  OverviewTab,
  ScheduleTab,
  ProgressTab,
  AchievementsTab,
  MessagesTab,
} from './components';
import type { User as UserType } from '@/types/dashboard';
import type { ChildData } from './types';

const user: UserType = { name: 'Emma Johnson', role: 'parent' };

const selectedKidType: 'group' | 'individual' = 'individual';

const childData: ChildData = {
  name: 'Emma Johnson',
  age: 8,
  coach: 'Coach Sarah',
  totalSessions: 24,
  achievements: 5,
  progress: 75,
};

const tabsConfig = [
  { value: 'overview', component: <OverviewTab childData={childData} /> },
  { value: 'achievements', component: <AchievementsTab /> },
  { value: 'schedule', component: <ScheduleTab /> },
  { value: 'progress', component: <ProgressTab /> },
  { value: 'messages', component: <MessagesTab /> },
];

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <DesktopTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        kidType={selectedKidType}
      >
        {tabsConfig.map(({ value, component }) => (
          <TabsContent
            key={value}
            value={value}
            className="space-y-6 pb-20 md:pb-6"
          >
            {component}
          </TabsContent>
        ))}
      </DesktopTabs>

      <MobileTabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        kidType={selectedKidType}
      />
    </div>
  );
}
