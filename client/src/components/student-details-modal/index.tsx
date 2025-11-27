'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Student } from '@/types/dashboard';

interface StudentDetailsModalProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

export default function StudentDetailsModal({
  student,
  open,
  onClose,
}: StudentDetailsModalProps) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#243E36]">
            {student.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">Age: {student.age} years old</p>
          <p className="text-sm text-gray-600">Location: {student.location}</p>
          <p className="text-sm text-gray-600">
            Contact: {student.contactNumber}
          </p>
          <p className="text-sm text-gray-600">
            Last Session: {student.lastSession}
          </p>
          <div>
            <p className="text-sm text-gray-600 font-medium">Session Dates:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {student.sessions?.map((session, idx) => (
                <li key={idx}>{session.toString()}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Progress:</p>
            <div className="w-40 h-2 bg-gray-200 rounded-full mt-1">
              <div
                className="h-2 bg-[#23B685] rounded-full"
                student-details-popup
                style={{ width: `${student.progress}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{student.progress}%</span>
          </div>
          <Badge className="bg-[#23B685] text-white">{student.status}</Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
