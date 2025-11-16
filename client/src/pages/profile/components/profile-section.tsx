"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Save } from "lucide-react";

interface ProfileFormData {
  name: string;
  email: string;
  location: string;
}

interface ProfileSectionProps {
  user: any;
  profileForm: ProfileFormData;
  setProfileForm: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  editingProfile: boolean;
  setEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveProfile: () => void;
  handleProfilePicUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updatingProfile: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  profileForm,
  setProfileForm,
  editingProfile,
  setEditingProfile,
  handleSaveProfile,
  handleProfilePicUpload,
  updatingProfile,
}) => {
  function getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>My Profile</CardTitle>
        {!editingProfile ? (
          <Button variant="outline" onClick={() => setEditingProfile(true)}>
            <Edit2 className="mr-2 h-4 w-4" /> Edit
          </Button>
        ) : (
          <Button onClick={handleSaveProfile} disabled={updatingProfile}>
            <Save className="mr-2 h-4 w-4" /> {updatingProfile ? "Saving..." : "Save"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6 flex-wrap">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={user.profilePic} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Label htmlFor="profile-pic" className="cursor-pointer text-sm text-primary">
              Upload Profile Picture
            </Label>
            <Input
              id="profile-pic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicUpload}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input
              value={profileForm.name}
              disabled={!editingProfile}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={profileForm.email}
              disabled={!editingProfile}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              value={profileForm.location}
              disabled={!editingProfile}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={user.phone || "N/A"} disabled />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
