'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ProgressTabProps {
  progress?: number;
}

export function ProgressTab({ progress }: ProgressTabProps) {

  return (
    <div className="space-y-6">
      <Card className="border-[#23B685]/20">
        <CardHeader>
          <CardTitle className="text-[#243E36] flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Progress {progress !== undefined ? `(${Math.round(progress)}%)` : ''}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
        </CardContent>
      </Card>
    </div>
  );
}
