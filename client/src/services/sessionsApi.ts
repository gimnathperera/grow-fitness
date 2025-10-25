import type {
  AvailabilityData,
  Coach,
  TimeSlot,
} from '@/types/session-booking';

export const fetchCoaches = async (): Promise<Coach[]> => {
  try {
    const res = await fetch('/api/coaches');
    if (!res.ok) throw new Error('Failed to fetch coaches');
    return await res.json();
  } catch (err) {
    console.error('Error fetching coaches:', err);
    return [
      { id: '1', name: 'Coach John' },
      { id: '2', name: 'Coach Sarah' },
      { id: '3', name: 'Coach Mike' },
    ];
  }
};

// Sample time slots
const sampleTimeSlots: TimeSlot[] = [
  { id: '1', time: '3:00 PM', available: true },
  { id: '2', time: '4:30 PM', available: true },
  { id: '3', time: '6:00 PM', available: true },
  { id: '4', time: '7:30 PM', available: true },
];

// Generate mock availability for each coach
const mockAvailability: Record<string, AvailabilityData> = {
  '1': {
    // Coach John
    coach_id: '1',
    session_type: 'group',
    available_dates: [
      { date: '2025-09-26', time_slots: sampleTimeSlots },
      { date: '2025-09-28', time_slots: sampleTimeSlots },
      { date: '2025-10-01', time_slots: sampleTimeSlots },
    ],
  },
  '2': {
    // Coach Sarah
    coach_id: '2',
    session_type: 'group',
    available_dates: [
      { date: '2025-09-27', time_slots: sampleTimeSlots },
      { date: '2025-09-29', time_slots: sampleTimeSlots },
      { date: '2025-10-02', time_slots: sampleTimeSlots },
    ],
  },
  '3': {
    // Coach Mike
    coach_id: '3',
    session_type: 'group',
    available_dates: [
      { date: '2025-09-26', time_slots: sampleTimeSlots },
      { date: '2025-09-30', time_slots: sampleTimeSlots },
      { date: '2025-10-03', time_slots: sampleTimeSlots },
    ],
  },
};

export const fetchAvailability = async (
  coachId: string,
  sessionType: string,
): Promise<AvailabilityData | null> => {
  try {
    // Try real API first
    const res = await fetch(
      `/api/availability?coach_id=${coachId}&session_type=${sessionType}`,
    );
    if (!res.ok) throw new Error('Failed to fetch availability');
    return await res.json();
  } catch (err) {
    console.error('Error fetching availability, using mock data:', err);
    // Return mock data based on coachId
    const data = mockAvailability[coachId];
    if (!data) return null;
    return {
      ...data,
      session_type: sessionType,
    };
  }
};
