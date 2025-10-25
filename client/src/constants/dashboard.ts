import {
  Calendar,
  Home,
  MessageCircle,
  TrendingUp,
  User,
  Plus,
  Users,
  Trophy,
  BookOpen,
  Target,
} from 'lucide-react';

// Dashboard Tabs
export const coachTabs = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'students', label: 'Students', icon: User },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
];

export const parentTabs = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export const coachQuickActions = [
  { icon: Plus, label: 'Add Session', primary: true },
  { icon: Users, label: 'View Students' },
  { icon: MessageCircle, label: 'Send Message' },
  { icon: Trophy, label: 'Award Badge' },
];

export const parentQuickActions = [
  { icon: Calendar, label: 'Book Session', primary: true },
  { icon: BookOpen, label: 'View Progress' },
  { icon: MessageCircle, label: 'Message Coach' },
  { icon: Target, label: 'Set Goals' },
];
