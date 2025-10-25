export interface Coach {
  id: string;
  name: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface AvailabilityData {
  coach_id: string;
  session_type: string;
  available_dates: {
    date: string;
    time_slots: TimeSlot[];
  }[];
}

export interface BookSessionData {
  coach: string;
  type: string;
  date: Date | undefined;
  time: string;
}
