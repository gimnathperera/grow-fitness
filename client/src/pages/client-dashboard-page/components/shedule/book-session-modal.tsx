import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

import type {
  BookSessionData,
  AvailabilityData,
  TimeSlot,
} from '@/types/session-booking';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useGetKidQuery } from '@/services/kidsApi';
import { useGetAvailabilityByCoachQuery, useCreateSessionMutation } from '@/services/sessionsRtkApi';

interface BookSessionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: BookSessionData) => void;
}
export default function BookSessionModal({
  open,
  onClose,
  onConfirm,
}: BookSessionModalProps) {
  // Using RTK query for availability and create session
  const [createSession, { isLoading: creating } ] = useCreateSessionMutation();

  // Derived from selected kid
  const selectedKidId = useSelector((state: RootState) => state.auth.selectedKidId);
  const { data: kidResp } = useGetKidQuery(selectedKidId as string, { skip: !selectedKidId });
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const clientId: string | undefined = currentUser
    ? String((currentUser as any).id || (currentUser as any)._id)
    : undefined;
  const coachId: string | undefined =
    (kidResp?.data as any)?.coach?.id || (kidResp?.data as any)?.coachId;
  const coachNameFromKid: string | undefined =
    (kidResp?.data as any)?.coach?.name || (kidResp?.data as any)?.coachName;
  const [coachDisplayName, setCoachDisplayName] = useState<string | undefined>(undefined);

  // Log kid and coach info
  useEffect(() => {
    console.log('[BookSessionModal] selectedKidId:', selectedKidId);
    console.log('[BookSessionModal] kidResp:', kidResp);
    console.log('[BookSessionModal] coachId from kid:', coachId);
    console.log('[BookSessionModal] coachName from kid:', coachNameFromKid);
    if (coachNameFromKid) setCoachDisplayName(coachNameFromKid);
  }, [selectedKidId, kidResp, coachId, coachNameFromKid]);

  // No direct API calls here per project structure; rely on kid payload only

  // Fixed type: Personal Training
  const type = 'personal_training';

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState<string | undefined>(undefined);

  // Availability via RTK (GET /sessions/check-availability)
  const { data: availabilityResp, isFetching: fetchingAvailability } = useGetAvailabilityByCoachQuery(
    { coachId: coachId as string, location },
    { skip: !coachId || !location }
  );
  const availability: AvailabilityData | null = (availabilityResp?.data as unknown as AvailabilityData) ?? null;

  // Reset picks when coach changes or availability refetches
  useEffect(() => {
    setDate(undefined);
    setTime('');
    setTimeSlots([]);
  }, [coachId, location]);

  // Update time slots when date changes
  useEffect(() => {
    if (date && availability) {
      const selectedDate = availability.available_dates.find(
        d => new Date(d.date).toDateString() === date.toDateString(),
      );
      setTimeSlots(
        selectedDate?.time_slots.filter(slot => slot.available) || [],
      );
      setTime('');
    }
  }, [date, availability]);

  const handleConfirm = async () => {
    if (!coachId || !selectedKidId || !date || !time || !clientId || !location) return;
    // Combine date and time => ISO, assume 60-minute duration
    const [hh, mm] = time.split(':').map(Number);
    const starts = new Date(date);
    starts.setHours(hh, mm ?? 0, 0, 0);
    const ends = new Date(starts.getTime() + 60 * 60 * 1000);

    try {
      // Optimistic UI: remove the selected slot immediately
      const prevSlots = timeSlots;
      setTimeSlots((slots) => slots.filter((s) => s.time !== time));

      console.log('[BookSessionModal] creating session with:', {
        coachId,
        clientId,
        kidId: selectedKidId,
        startsAt: starts.toISOString(),
        endsAt: ends.toISOString(),
      });
      await createSession({
        coachId,
        clientId,
        kidId: selectedKidId,
        startsAt: starts.toISOString(),
        endsAt: ends.toISOString(),
        location,
        sessionType: 'Personal Training',
      } as any).unwrap();
      onConfirm({ coach: coachId, type, date, time });
      // Clear selected time after successful booking
      setTime('');
      onClose();
    } catch (e) {
      console.error('[BookSessionModal] create session failed', e);
      // Revert optimistic removal on error
      setTimeSlots((slots) => {
        // If the slot isn't present, add it back
        const exists = slots.some((s) => s.time === time);
        return exists ? slots : [...slots, { id: `${time}`, time, available: true } as any];
      });
    }
  };

  const isDateAvailable = (currentDate: Date) =>
    !!availability?.available_dates.find(
      d => new Date(d.date).toDateString() === currentDate.toDateString(),
    );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[95vw] sm:w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-[95vh] max-h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden p-0 rounded-lg sm:rounded-xl flex flex-col z-1000">
        {/* Header */}
        <div className="flex-shrink-0 sticky top-0 bg-white z-20 border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 line-clamp-1">
              Book a Session
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-2">
              Choose your preferences to reserve a spot.
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
          >
            ✕
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-6">
          {/* Coach (from kid) */}
          <div className="space-y-1">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">Coach</Label>
            <div className="h-11 sm:h-12 w-full border border-gray-300 rounded-md flex items-center px-3 bg-gray-50 text-gray-700">
              {coachDisplayName ?? (coachId ? 'Loading...' : 'No coach assigned')}
            </div>
          </div>

          {/* Session Type (fixed) */}
          <div className="space-y-1">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">Session Type</Label>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[#23B685]/10 text-[#23B685] text-sm font-medium">
              Personal Training
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent className="text-sm sm:text-base z-[1050] max-h-60">
                {/* Prefill kid location only if allowed */}
                {(() => {
                  const kidLoc = ((kidResp?.data as any)?.location || '').toLowerCase();
                  const allowed = ['kirulapana', 'kollupitiya'];
                  if (allowed.includes(kidLoc)) {
                    const label = kidLoc.charAt(0).toUpperCase() + kidLoc.slice(1);
                    return (
                      <SelectItem value={label} className="py-2.5 sm:py-3">{label}</SelectItem>
                    );
                  }
                  return null;
                })()}
                <SelectItem value="Kirulapana" className="py-2.5 sm:py-3">Kirulapana</SelectItem>
                <SelectItem value="Kollupitiya" className="py-2.5 sm:py-3">Kollupitiya</SelectItem>
              </SelectContent>
            </Select>
            {location && (
              <p className="text-xs text-gray-500 mt-1">
                {location.toLowerCase() === 'kirulapana'
                  ? 'Available hours: 08:00–12:00 and 14:00–18:00'
                  : location.toLowerCase() === 'kollupitiya'
                  ? 'Available hours: 10:00–16:00'
                  : ''}
                {fetchingAvailability ? ' • Loading availability…' : ''}
              </p>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">
              Date
            </Label>
            <div className="rounded-lg border border-gray-300 p-2 sm:p-3 bg-white overflow-hidden">
              <Calendar
                className="w-full [&_table]:w-full [&_td]:p-1 sm:[&_td]:p-1.5 [&_button]:h-8 sm:[&_button]:h-10 [&_button]:w-8 sm:[&_button]:w-10 [&_button]:text-xs sm:[&_button]:text-sm [&_.rdp-head_cell]:text-xs sm:[&_.rdp-head_cell]:text-sm [&_.rdp-caption]:text-sm sm:[&_.rdp-caption]:text-base [&_.rdp-nav_button]:h-8 sm:[&_.rdp-nav_button]:h-9 [&_.rdp-nav_button]:w-8 sm:[&_.rdp-nav_button]:w-9"
                mode="single"
                selected={date}
                onSelect={d => d && location && isDateAvailable(d) && setDate(d)}
                disabled={d => !location || !isDateAvailable(d)}
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="space-y-3">
            <Label className="text-sm sm:text-base font-medium text-gray-700 block">
              Time Slot
            </Label>
            <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 ${!location ? 'opacity-50 pointer-events-none select-none' : ''}`}>
              {timeSlots.map(t => (
                <Button
                  key={t.id}
                  variant={time === t.time ? 'default' : 'outline'}
                  size="sm"
                  className={`h-11 sm:h-12 text-sm font-medium transition-all duration-200 ${time === t.time ? '!bg-primary hover:!bg-primary/90 shadow-sm' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'}`}
                  onClick={() => setTime(t.time)}
                >
                  {t.time}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex-shrink-0 border-t border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-6">
          <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto sm:min-w-[100px] h-11 sm:h-12 text-sm sm:text-base font-medium border-gray-300 hover:bg-gray-50 order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              className="w-full sm:w-auto sm:min-w-[140px] h-11 sm:h-12 text-sm sm:text-base font-medium disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm order-1 sm:order-2 !bg-primary hover:!bg-primary/90 shadow-lg"
              disabled={!coachId || !date || !time || !clientId || !location || creating}
              onClick={handleConfirm}
            >
              Confirm Booking
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
