import type { DashboardStats, Session, Student, User } from '@/types/dashboard';

// Mock user
export const user: User = { name: 'Sarah Johnson', role: 'coach' };

// Mock dashboard stats
export const stats: DashboardStats = {
  totalStudents: 18,
  todaySessions: 4,
  monthlyHours: 42,
  avgProgress: 79,
};

// Mock sessions
export const sessions: Session[] = [
  {
    id: 1,
    name: 'Kids Fitness Fun',
    time: '3:00 PM - 4:00 PM',
    studentsCount: 6,
    status: 'next',
  },
  {
    id: 2,
    name: 'Obstacle Course',
    time: '4:30 PM - 5:30 PM',
    studentsCount: 4,
    status: 'upcoming',
  },
  {
    id: 3,
    name: 'Teen Strength',
    time: '6:00 PM - 7:00 PM',
    studentsCount: 8,
    status: 'later',
  },
];

// Mock students
export const students: Student[] = [
  {
    id: 1,
    name: 'Emma Johnson',
    age: 8,
    progress: 75,
    lastSession: 'Yesterday',
    status: 'active',
  },
  {
    id: 2,
    name: 'Liam Smith',
    age: 10,
    progress: 82,
    lastSession: '2 days ago',
    status: 'active',
  },
  {
    id: 3,
    name: 'Sophia Davis',
    age: 7,
    progress: 68,
    lastSession: 'Today',
    status: 'active',
  },
  {
    id: 4,
    name: 'Noah Wilson',
    age: 9,
    progress: 91,
    lastSession: 'Yesterday',
    status: 'active',
  },
];
