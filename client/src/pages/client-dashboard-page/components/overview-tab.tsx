'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useGetKidQuery } from '@/services/kidsApi';
import { useEffect, useState } from 'react';
import { useGetUpcomingByKidQuery } from '@/services/sessionsRtkApi';
import { StatsGrid } from '@/components/stat-grid';
import type { User as UserType, DashboardStats, Session } from '@/types/dashboard';
import { sessions } from '@/data/coach/coach-dashboard';
import SessionDetailsModal from '@/components/session-details-modal';

interface OverviewTabProps {
  childData: {
    name: string;
    age: number;
    coach: string;
  };
}

const stats: DashboardStats = {
  totalChildren: 1,
  todaySessions: 1,
  upcomingSessions: 2,
  weeklyProgress: 75,
  avgProgress: 75,
};

const user: UserType = { name: 'Emma Johnson', role: 'parent' };

type SessionStatus = 'next' | 'upcoming' | 'later';

export function OverviewTab({ childData }: OverviewTabProps) {
  const selectedKidId = useSelector((state: RootState) => state.auth.selectedKidId);
  const { data: kidResp, isFetching: isKidLoading } = useGetKidQuery(selectedKidId as string, {
    skip: !selectedKidId,
  });
  const { data: upcomingKidResp, isFetching: loadingUpcoming } = useGetUpcomingByKidQuery(
    { kidId: selectedKidId as string, limit: 6 },
    { skip: !selectedKidId }
  );

  const displayName = kidResp?.data?.name ?? childData?.name;
  const displayAge = kidResp?.data?.age ?? childData?.age;
  const displayCoach = (kidResp?.data as any)?.coach?.name ?? childData?.coach;
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  useEffect(() => {
    console.log('[OverviewTab][UpcomingByKid] selectedKidId:', selectedKidId);
    if (!selectedKidId) {
      console.warn('[OverviewTab][UpcomingByKid] No kid selected; skipping fetch');
    }
  }, [selectedKidId]);

  useEffect(() => {
    if (!loadingUpcoming) {
      console.log('[OverviewTab][UpcomingByKid] response:', upcomingKidResp);
    }
  }, [loadingUpcoming, upcomingKidResp]);

  const getStatusBadge = (status: SessionStatus) => {
    const badges = {
      next: <Badge className="bg-[#23B685] text-white">Next</Badge>,
      upcoming: <Badge variant="outline">Upcoming</Badge>,
      later: <Badge variant="outline">Later</Badge>,
    };
    return badges[status];
  };

  const SessionItem = ({ session }: { session: Session }) => (
    <div
      onClick={() => setSelectedSession(session)}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
        session.status === 'next'
          ? 'bg-[#23B685]/5 hover:bg-[#23B685]/10'
          : 'border border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div>
        <h3 className="font-semibold text-[#243E36]">{session.name}</h3>
        <p className="text-sm text-gray-600">{session.time}</p>
        <p className="text-xs text-gray-500">
          {session.studentsCount}{' '}
          {user.role === 'coach' ? 'students enrolled' : 'spots available'}
        </p>
      </div>
      {getStatusBadge(session.status)}
    </div>
  );

  return (
    <>
      <div className="space-y-6 relative z-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Child Profile */}
          <Card className="border-[#23B685]/20">
            <CardHeader>
              <CardTitle className="text-[#243E36] flex items-center">
                <User className="mr-2 h-5 w-5" />
                Child Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-[#23B685]/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-[#23B685]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#243E36]">
                      {isKidLoading ? 'Loading...' : displayName}
                    </h3>
                    <p className="text-gray-600">{displayAge} years old</p>
                    <Badge variant="secondary" className="bg-[#23B685]/10 text-[#23B685]">
                      Active Member
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Coach:</span>
                    <span className="text-sm font-medium text-[#243E36]">{displayCoach}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Program:</span>
                    <span className="text-sm font-medium text-[#243E36]">Kids Fitness Fun</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member Since:</span>
                    <span className="text-sm font-medium text-[#243E36]">January 2024</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="border-[#23B685]/20 relative z-10">
            <CardHeader>
              <CardTitle className="text-[#243E36] flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                {user.role === 'coach' ? "Today's Schedule" : 'Upcoming Sessions'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto max-h-[400px]">
              {sessions.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <StatsGrid stats={stats} user={user} />
      </div>

      {/* Session Details Modal */}
      <SessionDetailsModal
        session={selectedSession}
        open={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
