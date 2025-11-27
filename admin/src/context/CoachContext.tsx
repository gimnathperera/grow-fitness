import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Coach, CoachFormData } from '@/types/coach';

interface CoachContextType {
  coaches: Coach[];
  addCoach: (data: CoachFormData) => void;
  deleteCoach: (id: string) => void;
  getCoach: (id: string) => Coach | undefined;
}

const CoachContext = createContext<CoachContextType | undefined>(undefined);

export const CoachProvider = ({ children }: { children: ReactNode }) => {
  const [coaches, setCoaches] = useState<Coach[]>([]);

  const addCoach = (data: CoachFormData) => {
    const newCoach: Coach = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setCoaches((prev) => [...prev, newCoach]);
  };

  const deleteCoach = (id: string) => {
    setCoaches((prev) => prev.filter((coach) => coach.id !== id));
  };

  const getCoach = (id: string) => {
    return coaches.find((coach) => coach.id === id);
  };

  return (
    <CoachContext.Provider value={{ coaches, addCoach, deleteCoach, getCoach }}>
      {children}
    </CoachContext.Provider>
  );
};

export const useCoaches = () => {
  const context = useContext(CoachContext);
  if (!context) {
    throw new Error('useCoaches must be used within a CoachProvider');
  }
  return context;
};
