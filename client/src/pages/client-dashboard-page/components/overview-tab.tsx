'use client';

import { useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Loader2 } from 'lucide-react';
import { useLazyGetKidQuery } from '@/services/kidsApi';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setSelectedKidId, setSelectedKidDetails } from '@/auth/authSlice';

interface OverviewTabProps {
  kidId: string | null;
}

export function OverviewTab({ kidId }: OverviewTabProps) {
  const dispatch = useDispatch();

  const [fetchKid, { data: kidData, isLoading, isError }] = useLazyGetKidQuery();

  useEffect(() => {
    const savedKidId = Cookies.get("kidId");

    if (savedKidId && !kidId) {
      dispatch(setSelectedKidId(savedKidId));

      fetchKid(savedKidId)
        .unwrap()
        .then(response => dispatch(setSelectedKidDetails(response.data)))
        .catch(console.log);
    }
  }, [dispatch, kidId, fetchKid]);

  useEffect(() => {
    if (!kidId) return;

    fetchKid(kidId)
      .unwrap()
      .then(res => dispatch(setSelectedKidDetails(res.data)))
      .catch(console.log);
  }, [kidId, fetchKid, dispatch]);

  const selectedKid = kidData;

  const kidAge = useMemo(() => {
    if (!selectedKid) return null;

    if (selectedKid.age) return selectedKid.age;

    if (selectedKid.birthDate) {
      const birthDate = new Date(selectedKid.birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return null;
  }, [selectedKid]);

  if (!kidId) return <div className="p-8 text-center text-gray-500">No kid selected</div>;
  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-[#23B685]" />;
  if (isError || !selectedKid)
    return <div className="p-8 text-center text-red-500">Failed to load kid's information</div>;

  const displayCoach = selectedKid.coachId || 'Not assigned';
  const memberSince = selectedKid.createdAt
    ? new Date(selectedKid.createdAt).toLocaleDateString()
    : 'N/A';

  return (
    <div className="space-y-6 relative z-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kid Profile */}
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
                  <h3 className="font-semibold text-[#243E36]">{selectedKid.name}</h3>

                  {kidAge !== null && (
                    <p className="text-gray-600">{kidAge} {kidAge === 1 ? 'year' : 'years'} old</p>
                  )}

                  <Badge variant="secondary" className="bg-[#23B685]/10 text-[#23B685] mt-1">
                    {selectedKid.status?.toLowerCase() === 'active'
                      ? 'Active Member'
                      : 'Inactive'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Coach:</span>
                  <span className="text-sm font-medium text-[#243E36]">{displayCoach}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Member Since:</span>
                  <span className="text-sm font-medium text-[#243E36]">{memberSince}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Gender:</span>
                  <span className="text-sm font-medium text-[#243E36]">{selectedKid.gender}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium text-[#243E36]">{selectedKid.location}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Training Preference:</span>
                  <span className="text-sm font-medium text-[#243E36] capitalize">
                    {selectedKid.trainingPreference}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Sports:</span>
                  <span className="text-sm font-medium text-[#243E36]">
                    {selectedKid.isInSports ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Medical Condition:</span>
                  <span className="text-sm font-medium text-[#243E36]">
                    {selectedKid.medicalCondition || "None"}
                  </span>
                </div>

                  {selectedKid.goals?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-sm text-gray-600">Goals:</span>
                    <ul className="list-disc ml-5 text-sm text-[#243E36]">
                      {selectedKid.goals.map((goal: string, i: number) => (
                        <li key={i}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            </div>
            <div className="space-y-3">
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="border-[#23B685]/20">
          <CardHeader>
            <CardTitle className="text-[#243E36] flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
