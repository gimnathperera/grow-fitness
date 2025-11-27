export const recentActivities = (userRole: string) => [
  {
    color: '#23B685',
    text:
      userRole === 'coach'
        ? 'Emma completed obstacle course'
        : 'Emma achieved new personal best',
    time: '1 hour ago',
  },
  {
    color: '#FFFD77',
    text:
      userRole === 'coach'
        ? 'New student enrolled: Alex Chen'
        : 'New badge earned: Team Player',
    time: '2 hours ago',
  },
  {
    color: '#23B685',
    text:
      userRole === 'coach'
        ? 'Liam achieved strength milestone'
        : 'Weekly goal completed',
    time: 'Yesterday',
  },
];
