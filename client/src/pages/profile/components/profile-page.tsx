"use client";

import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/hooks/store";
import { selectCurrentUser } from "@/auth/authSlice";
import { useUpdateClientMutation } from "@/services/clientsApi";
import { useUpdateKidMutation, useGetKidsQuery } from "@/services/kidsApi";
import type { UserProfile } from "@/types";

// Define the expected shape of the kid data for the form
interface FormKid {
  id: string;
  name: string;
  parentId: string;
  dateOfBirth?: string;
  age: number;
  gender?: 'boy' | 'girl';
  location?: string;
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, User, DollarSign, Clock } from "lucide-react";
import { ProfileSection } from "./profile-section";
import { KidsSection } from "./kids-section";
import { InvoicesSection } from "./invoice-section";
import { TimeSlotsSection } from "./time-slot-section";

interface LocalUser extends Omit<UserProfile, 'kids' | 'invoices' | 'timeSlots'> {
  kids: FormKid[];
  invoices: any[];
  timeSlots: any[]; // Temporarily using any[] to avoid TimeSlot type conflicts
}

export const ProfilePage: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  const [activeSection, setActiveSection] = useState<string>("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    location: "",
  });
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  
  // Ensure all kids have required fields with defaults
  const normalizeKids = (kids: any[]): FormKid[] => {
    return kids.map(kid => ({
      id: kid.id || '',
      name: kid.name || '',
      parentId: kid.parentId || '',
      dateOfBirth: kid.dateOfBirth,
      age: typeof kid.age === 'number' ? kid.age : 0,
      gender: kid.gender,
      location: kid.location
    }));
  };

  const [updateClient, { isLoading: updatingProfile }] = useUpdateClientMutation();
  const [updateKid, { isLoading: updatingKid }] = useUpdateKidMutation();

  // Fetch kids for parent
  const { data: kidsData } = useGetKidsQuery(
    user?.role === "parent" && user?.id ? { parentId: user.id } : undefined,
    { skip: !user || user.role !== "parent" }
  );

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
      });

      setLocalUser({
        ...user,
        kids: Array.isArray(user.kids) ? normalizeKids(user.kids) : [],
        invoices: Array.isArray(user.invoices) ? user.invoices : [],
        timeSlots: Array.isArray(user.timeSlots) ? user.timeSlots : [],
      });
    }
  }, [user]);

  // Update localUser with kids from API
  useEffect(() => {
    if (kidsData?.data && localUser) {
      setLocalUser(prev => prev ? { 
        ...prev, 
        kids: normalizeKids(kidsData.data)
      } : prev);
    }
  }, [kidsData, localUser]);

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalUser(prev => prev ? { ...prev, profilePic: reader.result as string } : prev);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const response = await updateClient({
        id: user.id,
        payload: profileForm,
      }).unwrap();

      setLocalUser(prev => prev ? { ...prev, ...response.data } : prev);
      setEditingProfile(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
  };

  const handleKidChange = (kidId: string, field: keyof FormKid, value: any) => {
    setLocalUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        kids: (prev.kids || []).map(k => 
          (k.id === kidId || (k as any)._id === kidId) ? { ...k, [field]: value } : k
        )
      };
    });
  };

  const handleSaveKid = async (kid: FormKid) => {
    try {
      const payload: Partial<FormKid> = {
        name: kid.name,
        age: kid.age,
        parentId: kid.parentId
      };

      // Add optional fields if they exist
      if (kid.gender) payload.gender = kid.gender;
      if (kid.location) payload.location = kid.location;
      if (kid.dateOfBirth) payload.dateOfBirth = kid.dateOfBirth;

      await updateKid({
        id: kid.id,
        payload
      }).unwrap();
    } catch (err) {
      console.error("Failed to save kid:", err);
    }
  };

  if (!user) return <div className="container mx-auto py-8 px-4">Loading user data...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-8 h-fit">
          <Card className="shadow-lg border-0 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary/90 p-6 text-white">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img 
                    src={user.profilePic || '/default-avatar.png'} 
                    alt="Profile" 
                    className="h-20 w-20 rounded-full border-4 border-white/80 shadow-md" 
                  />
                </div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
                <Badge className="mt-1 bg-white/20 hover:bg-white/30 text-white">
                  {user.role === "client" ? "Client" : "Coach"}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4 space-y-1">
              <nav className="space-y-1">
                <Button
                  variant={activeSection === "profile" ? "secondary" : "ghost"}
                  className={`w-full justify-start ${activeSection === "profile" ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveSection("profile")}
                >
                  <User className="mr-3 h-5 w-5" />
                  <span className="font-medium">My Profile</span>
                </Button>
                
                {user.role === "parent" && (
                  <>
                    <Button
                      variant={activeSection === "kids" ? "secondary" : "ghost"}
                      className={`w-full justify-start ${activeSection === "kids" ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50'}`}
                      onClick={() => setActiveSection("kids")}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="mr-3"
                      >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      <span className="font-medium">My Kids</span>
                    </Button>
                    
                    <Button
                      variant={activeSection === "invoices" ? "secondary" : "ghost"}
                      className={`w-full justify-start ${activeSection === "invoices" ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50'}`}
                      onClick={() => setActiveSection("invoices")}
                    >
                      <DollarSign className="mr-3 h-5 w-5" />
                      <span className="font-medium">Payment Invoices</span>
                    </Button>
                  </>
                )}
                
                {user.role === "coach" && (
                  <Button
                    variant={activeSection === "timeslots" ? "secondary" : "ghost"}
                    className={`w-full justify-start ${activeSection === "timeslots" ? 'bg-primary/5 text-primary' : 'hover:bg-gray-50'}`}
                    onClick={() => setActiveSection("timeslots")}
                  >
                    <Clock className="mr-3 h-5 w-5" />
                    <span className="font-medium">Time Slots</span>
                  </Button>
                )}
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          {activeSection === "profile" && localUser && (
            <ProfileSection
              user={localUser}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              editingProfile={editingProfile}
              setEditingProfile={setEditingProfile}
              handleSaveProfile={handleSaveProfile}
              handleProfilePicUpload={handleProfilePicUpload}
              updatingProfile={updatingProfile}
            />
          )}

          {activeSection === "kids" && localUser && (
            <KidsSection
              kids={localUser.kids || []}
              handleKidChange={handleKidChange}
              handleSaveKid={handleSaveKid}
              updatingKid={updatingKid}
            />
          )}

          {activeSection === "invoices" && localUser && (
            <InvoicesSection invoices={localUser.invoices || []} />
          )}

          {activeSection === "timeslots" && localUser && (
            <TimeSlotsSection timeSlots={localUser.timeSlots || []} />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
