"use client";

import { useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

import { useLazyGetKidQuery } from "@/services/kidsApi";
import { useGetUpcomingByKidQuery } from "@/services/sessionsRtkApi";

import { setSelectedKidId, setSelectedKidDetails } from "@/auth/authSlice";

interface OverviewTabProps {
  kidId: string | null;
}

export function OverviewTab({ kidId }: OverviewTabProps) {
  const dispatch = useDispatch();

  const [fetchKid, { data: kidData, isLoading }] = useLazyGetKidQuery();

  // ---------- FETCH KID ----------
  useEffect(() => {
    const savedKidId = Cookies.get("kidId");

    if (savedKidId && !kidId) {
      dispatch(setSelectedKidId(savedKidId));

      fetchKid(savedKidId)
        .unwrap()
        .then((res) => dispatch(setSelectedKidDetails(res.data)))
        .catch(console.log);
    }
  }, [kidId, fetchKid, dispatch]);

  useEffect(() => {
    if (!kidId) return;

    fetchKid(kidId)
      .unwrap()
      .then((res) => dispatch(setSelectedKidDetails(res.data)))
      .catch(console.log);
  }, [kidId, fetchKid, dispatch]);

  const selectedKid = kidData;

  // ---------- FETCH UPCOMING SESSIONS ----------
  const {
    data: sessionData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useGetUpcomingByKidQuery({ kidId: kidId! }, { skip: !kidId });

  const sessions = sessionData?.data || [];

  // ---------- AGE ----------
  const kidAge = useMemo(() => {
    if (!selectedKid) return null;

    if (selectedKid.age) return selectedKid.age;

    if (selectedKid.birthDate) {
      const bd = new Date(selectedKid.birthDate);
      const now = new Date();
      let age = now.getFullYear() - bd.getFullYear();

      if (
        now.getMonth() < bd.getMonth() ||
        (now.getMonth() === bd.getMonth() && now.getDate() < bd.getDate())
      ) {
        age--;
      }
      return age;
    }

    return null;
  }, [selectedKid]);

  // ---------- UI STATES ----------
  if (!kidId) return <div className="p-8 text-center text-gray-500">No kid selected</div>;
  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-[#23B685]" />;
  if (!selectedKid) return <div className="p-8 text-center text-red-500">Failed to load child</div>;

  const memberSince = selectedKid.createdAt
    ? new Date(selectedKid.createdAt).toLocaleDateString()
    : "N/A";

  const displayCoach = selectedKid.coachId || "Not Assigned";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ---------- CHILD PROFILE ---------- */}
        <Card className="border-[#23B685]/20">
          <CardHeader>
            <CardTitle className="text-[#243E36] flex items-center">
              <User className="mr-2 h-5 w-5" />
              Child Profile
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-[#23B685]/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-[#23B685]" />
              </div>

              <div>
                <h3 className="font-semibold text-[#243E36]">{selectedKid.name}</h3>

                {kidAge !== null && (
                  <p className="text-gray-600">{kidAge} {kidAge === 1 ? "year" : "years"} old</p>
                )}

                <Badge className="bg-[#23B685]/10 text-[#23B685] mt-1">
                  {selectedKid.status?.toLowerCase() === "active" ? "Active Member" : "Inactive"}
                </Badge>
              </div>
            </div>

            {/* Kid Info */}
            <div className="space-y-2">
              <InfoRow label="Current Coach" value={displayCoach} />
              <InfoRow label="Member Since" value={memberSince} />
              <InfoRow label="Gender" value={selectedKid.gender} />
              <InfoRow label="Location" value={selectedKid.location} />
              <InfoRow label="Training Preference" value={selectedKid.trainingPreference} />
              <InfoRow label="In Sports" value={selectedKid.isInSports ? "Yes" : "No"} />
              <InfoRow label="Medical Condition" value={selectedKid.medicalCondition || "None"} />

              {selectedKid.goals?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Goals:</p>
                  <ul className="ml-5 list-disc text-sm text-[#243E36]">
                    {selectedKid.goals.map((g: string, i: number) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---------- UPCOMING SESSIONS ---------- */}
        <Card className="border-[#23B685]/20">
          <CardHeader>
            <CardTitle className="text-[#243E36] flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">

            {sessionsLoading && (
              <Loader2 className="h-6 w-6 animate-spin text-[#23B685]" />
            )}

            {sessionsError && (
              <p className="text-red-500">Failed to load sessions</p>
            )}

            {!sessionsLoading && sessions.length === 0 && (
              <p className="text-gray-500">No upcoming sessions</p>
            )}

            {sessions.map((session: any) => (
              <div
                key={session.id}
                className="p-3 border rounded-lg shadow-sm bg-white"
              >
                <p className="text-[#243E36] font-medium">{session.title}</p>
                <p className="text-sm text-gray-500">{session.date}</p>
                <p className="text-sm text-gray-500">{session.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Small Reusable Component
function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-[#243E36]">{value}</span>
    </div>
  );
}
