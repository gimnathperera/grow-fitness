"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TimeSlot } from "@/types/session-booking";

interface TimeSlotsSectionProps {
  timeSlots: TimeSlot[];
}

export const TimeSlotsSection: React.FC<TimeSlotsSectionProps> = ({ timeSlots }) => {
  if (!timeSlots || timeSlots.length === 0) return <p className="text-gray-500">No time slots available.</p>;

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader>
        <CardTitle>My Time Slots</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {timeSlots.map((ts) => (
          <div key={ts.id} className="flex justify-between items-center p-3 border rounded-md border-gray-200">
            <span>{ts.day} - {ts.time}</span>
            <Badge variant={ts.available ? "secondary" : "destructive"}>
              {ts.available ? "Available" : "Booked"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
