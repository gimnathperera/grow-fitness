import { coachTabs } from '@/constants/dashboard';
import { Home, Calendar, Trophy, TrendingUp } from 'lucide-react';

const parentGroupTabs = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
];

const parentIndividualTabs = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export function getTabsForUser(
  role: string,
  kidType?: 'group' | 'individual'
) {
  if (role === 'coach') return coachTabs;
  if (role === 'parent') {
    if (kidType === 'group') return parentGroupTabs;
    if (kidType === 'individual') return parentIndividualTabs;
  }
  return [];
}
