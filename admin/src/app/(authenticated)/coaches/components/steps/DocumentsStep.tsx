import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CoachFormData } from '@/types/coach';
import { FileText, Upload, X, User, Mail, Phone, MapPin, Building, Calendar, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface DocumentsStepProps {
  formData: CoachFormData;
  updateFormData: (data: Partial<CoachFormData>) => void;
}

const DocumentsStep = ({ formData, updateFormData }: DocumentsStepProps) => {
  const cvInputRef = useRef<HTMLInputElement>(null);

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData({
        cvFile: file,
        cvFileName: file.name,
      });
    }
  };

  const removeCv = () => {
    updateFormData({
      cvFile: null,
      cvFileName: null,
    });
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* CV Upload */}
      <div className="space-y-3">
        <Label>CV / Resume Upload</Label>
        <input
          type="file"
          ref={cvInputRef}
          onChange={handleCVChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />

        {formData.cvFileName ? (
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{formData.cvFileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.cvFile?.size
                      ? `${(formData.cvFile.size / 1024).toFixed(1)} KB`
                      : 'Unknown size'}
                  </p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={removeCv}>
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card
            className="cursor-pointer border-dashed transition-colors hover:border-primary"
            onClick={() => cvInputRef.current?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload CV</p>
              <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (Max 10MB)</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Summary Preview */}
      <div className="space-y-3">
        <Label>Review Information</Label>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={formData.photo || undefined} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{formData.name || 'No name provided'}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {formData.employmentType.charAt(0).toUpperCase() + formData.employmentType.slice(1)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              {formData.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.email}</span>
                </div>
              )}
              {formData.contactNo && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.contactNo}</span>
                </div>
              )}
              {formData.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(formData.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
              {formData.school && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.school}</span>
                </div>
              )}
              {formData.homeAddress && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.homeAddress}</span>
                </div>
              )}
            </div>

            {formData.skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {formData.availability.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Availability</p>
                <div className="text-sm text-muted-foreground">
                  {formData.availability.map((slot, i) => (
                    <div key={i}>
                      {slot.day}: {slot.from} - {slot.to}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsStep;
