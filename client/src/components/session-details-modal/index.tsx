'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Session } from '@/types/dashboard';

interface SessionDetailsModalProps {
  session: Session | null;
  open: boolean;
  onClose: () => void;
}

export default function SessionDetailsModal({
  session,
  open,
  onClose,
}: SessionDetailsModalProps) {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#243E36]">
            {session.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Type:</span>{' '}
            {session.type === 'group' ? 'Group Session' : 'Individual Session'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {session.location}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Time:</span> {session.time}
          </p>

          <div>
            <p className="text-sm font-medium text-gray-600">Students:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {session.students?.map((student, idx) => (
                <li key={idx}>{student}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600">
              Other Session Dates:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {session.dates?.map((date, idx) => (
                <li key={idx}>{date}</li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
