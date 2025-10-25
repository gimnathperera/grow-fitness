export type SessionType = 'group' | 'individual';
export type TaskType = 'fitness' | 'wellness' | 'nutrition';
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  completedAt?: string;
}

export interface Milestone {
  id: string;
  name: string;
  badgeUrl: string;
  achievedAt?: string;
  tasks: Task[];
}

export interface Kid {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  sessionType: SessionType;
  avatarUrl: string;
  
  // Individual session specific data
  totalSessions?: number;
  bmi?: number;
  height?: number;
  weight?: number;
  achievedMilestones?: Milestone[];
  currentMilestone?: Milestone;
}

export const mockMilestones: Milestone[] = [
  {
    id: 'm1',
    name: 'First Steps',
    badgeUrl: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=100&h=100&fit=crop',
    achievedAt: '2025-01-15',
    tasks: [
      { id: 't1', type: 'fitness', title: 'Complete 5 workouts', description: 'Attend and complete 5 fitness sessions', status: 'completed', completedAt: '2025-01-10' },
      { id: 't2', type: 'wellness', title: 'Sleep 8 hours daily', description: 'Maintain consistent sleep schedule for 7 days', status: 'completed', completedAt: '2025-01-12' },
      { id: 't3', type: 'nutrition', title: 'Eat 5 fruits/veggies daily', description: 'Track fruit and vegetable intake for 7 days', status: 'completed', completedAt: '2025-01-14' }
    ]
  },
  {
    id: 'm2',
    name: 'Rising Star',
    badgeUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=100&h=100&fit=crop',
    achievedAt: '2025-02-20',
    tasks: [
      { id: 't4', type: 'fitness', title: '10 pushups', description: 'Complete 10 consecutive pushups', status: 'completed', completedAt: '2025-02-15' },
      { id: 't5', type: 'wellness', title: 'Meditation streak', description: 'Meditate for 10 minutes, 7 days in a row', status: 'completed', completedAt: '2025-02-18' },
      { id: 't6', type: 'nutrition', title: 'Water intake', description: 'Drink 8 glasses of water daily for 7 days', status: 'completed', completedAt: '2025-02-19' }
    ]
  }
];

export const mockCurrentMilestone: Milestone = {
  id: 'm3',
  name: 'Champion',
  badgeUrl: 'https://images.unsplash.com/photo-1624024297091-8f1d9e3f2e0f?w=100&h=100&fit=crop',
  tasks: [
    { id: 't7', type: 'fitness', title: 'Run 1 mile', description: 'Complete a 1-mile run under 10 minutes', status: 'completed', completedAt: '2025-03-05' },
    { id: 't8', type: 'wellness', title: 'Gratitude journal', description: 'Write 3 things you\'re grateful for, 14 days', status: 'pending' },
    { id: 't9', type: 'nutrition', title: 'Balanced meals', description: 'Eat balanced meals with protein, carbs, and veggies for 10 days', status: 'pending' }
  ]
};

export const mockKids: Kid[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    age: 10,
    gender: 'female',
    location: 'Seattle, WA',
    sessionType: 'individual',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    totalSessions: 24,
    bmi: 16.5,
    height: 142,
    weight: 33,
    achievedMilestones: mockMilestones,
    currentMilestone: mockCurrentMilestone
  },
  {
    id: '2',
    name: 'Liam Smith',
    age: 12,
    gender: 'male',
    location: 'Portland, OR',
    sessionType: 'individual',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    totalSessions: 18,
    bmi: 17.8,
    height: 152,
    weight: 41,
    achievedMilestones: [mockMilestones[0]],
    currentMilestone: {
      ...mockMilestones[1],
      achievedAt: undefined,
      tasks: [
        { id: 't10', type: 'fitness', title: '10 pushups', description: 'Complete 10 consecutive pushups', status: 'pending' },
        { id: 't11', type: 'wellness', title: 'Meditation streak', description: 'Meditate for 10 minutes, 7 days in a row', status: 'pending' },
        { id: 't12', type: 'nutrition', title: 'Water intake', description: 'Drink 8 glasses of water daily for 7 days', status: 'pending' }
      ]
    }
  },
  {
    id: '3',
    name: 'Sophia Davis',
    age: 8,
    gender: 'female',
    location: 'Seattle, WA',
    sessionType: 'group',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
  },
  {
    id: '4',
    name: 'Noah Wilson',
    age: 11,
    gender: 'male',
    location: 'Bellevue, WA',
    sessionType: 'group',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
  },
  {
    id: '5',
    name: 'Olivia Brown',
    age: 9,
    gender: 'female',
    location: 'Tacoma, WA',
    sessionType: 'individual',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    totalSessions: 32,
    bmi: 15.9,
    height: 138,
    weight: 30,
    achievedMilestones: mockMilestones,
    currentMilestone: mockCurrentMilestone
  },
  {
    id: '6',
    name: 'Ethan Martinez',
    age: 13,
    gender: 'male',
    location: 'Olympia, WA',
    sessionType: 'group',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan',
  }
];
