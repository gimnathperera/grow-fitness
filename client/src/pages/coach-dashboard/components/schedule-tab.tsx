'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import SessionDetailsModal from '@/components/session-details-modal';
import { useGetSessionsQuery, useGetUpcomingByKidQuery } from '@/services/sessionsRtkApi';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useGetKidQuery } from '@/services/kidsApi';

type CalendarEvent = {
  _id?: string;
  title: string;
  date: Date;
  session?: any;
};

export default function ScheduleTab() {
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [openBooking, setOpenBooking] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const selectedKidId = useSelector((state: RootState) => state.auth.selectedKidId);
  const { data: kidResp } = useGetKidQuery(selectedKidId as string, { skip: !selectedKidId });
  const coachId: string | undefined =
    (kidResp?.data as any)?.coach?.id || (kidResp?.data as any)?.coachId;

  // month start/end
  const [dateFrom, dateTo] = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const start = new Date(y, m, 1, 0, 0, 0, 0);
    const end = new Date(y, m + 1, 0, 23, 59, 59, 999);
    return [start.toISOString(), end.toISOString()] as const;
  }, [currentDate]);

  // fetch sessions (prefer kidId; fallback to coachId)
  const sessionsParams =
    dateFrom && dateTo
      ? {
          ...(selectedKidId ? { kidId: selectedKidId as string } : coachId ? { coachId } : {}),
          dateFrom,
          dateTo,
          page: 1,
          limit: 50,
        }
      : undefined;
  const { data: sessionsResp } = useGetSessionsQuery(sessionsParams, { skip: !sessionsParams });
  const sessions = sessionsResp?.data?.sessions ?? [];

  useGetUpcomingByKidQuery(
    { kidId: selectedKidId as string, limit: 6 },
    { skip: !selectedKidId }
  );

  const events: CalendarEvent[] = sessions.map((s: any) => ({
    _id: s?._id,
    title: s?.sessionType || s?.name || 'Session',
    date: new Date(s?.startsAt),
    session: s,
  }));

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleBookingConfirm = (data: any) => {
    console.log('Booking confirmed:', data);
  };

  // Generate grid for the month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(year, month, i));

  const monthLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <>
      <Card className="border-[#23B685]/20 shadow-sm">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Month Label */}
        <CardTitle className="flex items-center justify-center md:justify-start text-base md:text-lg font-semibold text-[#243E36]">
          <CalendarIcon className="mr-2 h-5 w-5 text-[#23B685]" />
          {monthLabel}
        </CardTitle>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="text-[#243E36] hover:bg-[#23B685]/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleToday}
            className="text-[#243E36] hover:bg-[#23B685]/10"
          >
            Today
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="text-[#243E36] hover:bg-[#23B685]/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>


        <CardContent>
          <div className="grid grid-cols-7 gap-[1px] bg-[#23B685]/10 rounded-lg overflow-hidden text-center text-xs sm:text-sm">
            {/* Weekday headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="p-2 font-medium bg-[#23B685]/5 text-[#243E36]">
                {d}
              </div>
            ))}

            {/* Days */}
            {calendarDays.map((day, idx) => {
              const dayEvents = events.filter(
                (e) =>
                  day &&
                  e.date.getFullYear() === day.getFullYear() &&
                  e.date.getMonth() === day.getMonth() &&
                  e.date.getDate() === day.getDate()
              );

              const isToday =
                day &&
                new Date().getDate() === day.getDate() &&
                new Date().getMonth() === day.getMonth() &&
                new Date().getFullYear() === day.getFullYear();

              return (
                <div
                  key={idx}
                  className={`min-h-[90px] sm:min-h-[110px] p-2 flex flex-col items-start justify-start ${
                    day ? 'bg-white cursor-pointer hover:bg-[#23B685]/5' : 'bg-gray-50'
                  } ${isToday ? 'border border-[#23B685]' : ''}`}
                >
                  <div className="text-gray-600 text-xs mb-1">{day ? day.getDate() : ''}</div>
                 {dayEvents.map((event) => {
                    const isGroup = event.session?.sessionType?.toLowerCase() === 'group';

                    return (
                      <div
                        key={event._id}
                        onClick={() => setSelectedSession(event.session)}
                        className={`w-full text-xs p-1 rounded-md truncate transition-colors duration-200
                          ${
                            isGroup
                              ? 'bg-[#23B685]/15 hover:bg-[#23B685]/25 text-[#23B685]' // lighter shade for group
                              : 'bg-[#1e8d67]/25 hover:bg-[#1e8d67]/40 text-[#1e8d67]' // darker green for individual
                          }`}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event details modal */}
      <SessionDetailsModal
        session={selectedSession}
        open={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
