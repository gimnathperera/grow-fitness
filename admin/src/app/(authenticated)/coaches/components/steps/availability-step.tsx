import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CoachFormData, Availability, DAYS_OF_WEEK, DEFAULT_SKILLS, EMPLOYMENT_TYPES } from '@/types/coach';
import { Plus, Trash2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AvailabilityStepProps {
  formData: CoachFormData;
  updateFormData: (data: Partial<CoachFormData>) => void;
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

const AvailabilityStep = ({ formData, updateFormData }: AvailabilityStepProps) => {
  const [newSlot, setNewSlot] = useState<Availability>({
    day: 'Monday',
    from: '09:00',
    to: '17:00',
  });

  const addAvailability = () => {
    if (newSlot.from >= newSlot.to) {
      return;
    }
    updateFormData({
      availability: [...formData.availability, { ...newSlot }],
    });
  };

  const removeAvailability = (index: number) => {
    updateFormData({
      availability: formData.availability.filter((_, i) => i !== index),
    });
  };

  const toggleSkill = (skill: string) => {
    const hasSkill = formData.skills.includes(skill);
    if (hasSkill) {
      updateFormData({
        skills: formData.skills.filter((s) => s !== skill),
      });
    } else {
      updateFormData({
        skills: [...formData.skills, skill],
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Employment Type */}
      <div className="space-y-2">
        <Label>Employment Type</Label>
        <Select
          value={formData.employmentType}
          onValueChange={(value: CoachFormData['employmentType']) =>
            updateFormData({ employmentType: value })
          }
        >
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select employment type" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYMENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Availability Slots */}
      <div className="space-y-4">
        <Label>Available Times</Label>
        
        {/* Add New Slot */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Day</Label>
                <Select
                  value={newSlot.day}
                  onValueChange={(value) => setNewSlot((prev) => ({ ...prev, day: value }))}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">From</Label>
                <Select
                  value={newSlot.from}
                  onValueChange={(value) => setNewSlot((prev) => ({ ...prev, from: value }))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">To</Label>
                <Select
                  value={newSlot.to}
                  onValueChange={(value) => setNewSlot((prev) => ({ ...prev, to: value }))}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="button" onClick={addAvailability} size="sm">
                <Plus className="mr-1 h-4 w-4" />
                Add Slot
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing Slots */}
        {formData.availability.length > 0 ? (
          <div className="space-y-2">
            {formData.availability.map((slot, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{slot.day}</span>
                  <span className="text-muted-foreground">
                    {slot.from} - {slot.to}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAvailability(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No availability slots added yet. Add at least one slot above.
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label>Skills (Select all that apply)</Label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SKILLS.map((skill) => (
            <Badge
              key={skill}
              variant={formData.skills.includes(skill) ? 'default' : 'outline'}
              className="cursor-pointer transition-colors"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityStep;
