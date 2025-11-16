export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'admin' | 'coach' | 'client' | 'team';
  location?: string;
  phone?: string;
  status?: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add other user properties as needed
}

export interface Kid {
  id: string;
  name: string;
  parentId: string;
  dateOfBirth?: string;
  age?: number;
  // Add other kid properties as needed
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  coachId?: string;
  // Add other timeslot properties as needed
}

// Add other shared types here as needed
