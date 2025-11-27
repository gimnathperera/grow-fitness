import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';
import { CoachFormData } from '@/types/coach';

interface PersonalInfoStepProps {
  formData: CoachFormData;
  updateFormData: (data: Partial<CoachFormData>) => void;
}

const PersonalInfoStep = ({ formData, updateFormData }: PersonalInfoStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateFormData({ photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Photo Upload */}
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={formData.photo || undefined} alt="Coach photo" />
          <AvatarFallback>
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoChange}
          accept="image/*"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera className="mr-2 h-4 w-4" />
          Upload Photo
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter full name"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData({ dateOfBirth: e.target.value })}
          />
        </div>

        {/* Contact Number */}
        <div className="space-y-2">
          <Label htmlFor="contactNo">
            Contact Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactNo"
            type="tel"
            value={formData.contactNo}
            onChange={(e) => updateFormData({ contactNo: e.target.value })}
            placeholder="+1 234 567 8900"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="coach@example.com"
          />
        </div>

        {/* School */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="school">School/Organization</Label>
          <Input
            id="school"
            value={formData.school}
            onChange={(e) => updateFormData({ school: e.target.value })}
            placeholder="Enter school or organization name"
          />
        </div>

        {/* Home Address */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Home Address</Label>
          <Input
            id="address"
            value={formData.homeAddress}
            onChange={(e) => updateFormData({ homeAddress: e.target.value })}
            placeholder="Enter home address"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
