import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import type { Student } from '@/types/dashboard';

interface ProgressTabProps {
  students: Student[];
}

interface MetricCardProps {
  value: string | number;
  label: string;
  bgClass: string;
  textClass?: string;
}

const MetricCard = ({
  value,
  label,
  bgClass,
  textClass = 'text-[#243E36]',
}: MetricCardProps) => (
  <div className={`text-center p-4 rounded-lg ${bgClass}`}>
    <h3 className={`text-2xl font-bold ${textClass}`}>{value}</h3>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const TopPerformer = ({
  student,
  rank,
}: {
  student: Student;
  rank: number;
}) => {
  const bgClass =
    rank === 1
      ? 'bg-[#FFFD77] text-[#243E36]'
      : rank === 2
        ? 'bg-gray-400'
        : 'bg-orange-400';

  return (
    <div className="flex items-center justify-between p-3 border border-[#23B685]/20 rounded-lg">
      <div className="flex items-center space-x-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${bgClass}`}
        >
          {rank}
        </div>
        <div>
          <p className="font-medium text-[#243E36]">{student.name}</p>
          <p className="text-sm text-gray-600">{student.progress}% progress</p>
        </div>
      </div>
      <Trophy className="h-5 w-5 text-[#FFFD77]" />
    </div>
  );
};

export default function ProgressTab({ students }: ProgressTabProps) {
  const metrics = [
    { value: '79%', label: 'Average Progress', bgClass: 'bg-[#23B685]/5' },
    { value: 12, label: 'Badges Awarded', bgClass: 'bg-[#FFFD77]/20' },
    { value: '95%', label: 'Attendance Rate', bgClass: 'bg-[#23B685]/5' },
  ];

  return (
    <Card className="border-[#23B685]/20">
      <CardHeader>
        <CardTitle className="text-[#243E36]">
          Student Progress Overview
        </CardTitle>
        <CardDescription>
          Track how your students are improving over time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map(metric => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-[#243E36]">
            Top Performers This Month
          </h4>
          {students.slice(0, 3).map((student, idx) => (
            <TopPerformer key={student.id} student={student} rank={idx + 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
