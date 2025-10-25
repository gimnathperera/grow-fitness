import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Plus } from 'lucide-react';
import type { Student } from '@/types/dashboard';
import CoachKidModal from './kids-list/kid-details';

interface StudentsTabProps {
  students: Student[];
}

const StudentRow = ({
  student,
  onClick,
}: {
  student: Student;
  onClick: () => void;
}) => {
  const initials = student.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 border border-[#23B685]/20 rounded-lg hover:bg-[#23B685]/5 transition-colors cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback className="bg-[#23B685] text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-black">{student.name}</h3>
          <p className="text-sm text-gray-600">{student.age} years old</p>
          <p className="text-xs text-gray-500">
            Last session: {student.lastSession}
          </p>
          {student.group && (
            <Badge variant="outline" className="mt-1 text-xs">
              {student.group}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-[#243E36]">
            Progress: {student.progress}%
          </p>
          <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-2 bg-[#23B685] rounded-full"
              style={{ width: `${student.progress}%` }}
            />
          </div>
        </div>
        <Badge className="bg-[#23B685] text-white">{student.status}</Badge>
      </div>
    </div>
  );
};

export default function StudentsTab({ students }: StudentsTabProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [sessionType, setSessionType] = useState<'individual' | 'group'>('individual');
  const [selectedGroup, setSelectedGroup] = useState<'Group A' | 'Group B' | 'Group C' | 'all'>('all');

  const filteredStudents = students.filter(student => {
    if (student.sessionType !== sessionType) return false;
    
    if (sessionType === 'group' && selectedGroup !== 'all') {
      return student.group === selectedGroup;
    }
    
    return true;
  });

  return (
    <>
      <Card className="border-[#23B685]/20">
        <CardHeader>
          <CardTitle className="text-[#243E36] flex items-center justify-between">
            <span className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              My Students
            </span>
            <Button
              size="sm"
              className="!bg-primary hover:!bg-primary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </CardTitle>
          <CardDescription>
            Manage and track your students' progress
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs value={sessionType} onValueChange={(v) => setSessionType(v as 'individual' | 'group')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="individual"
                className="data-[state=active]:!bg-primary data-[state=active]:text-white"
              >
                Individual Sessions
              </TabsTrigger>
              <TabsTrigger
                value="group"
                className="data-[state=active]:!bg-primary data-[state=active]:text-white"
              >
                Group Sessions
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {sessionType === 'group' && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedGroup === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedGroup('all')}
                className={selectedGroup === 'all' ? 'bg-[#23B685] hover:bg-[#23B685]/90' : ''}
              >
                All Groups
              </Button>
              <Button
                size="sm"
                variant={selectedGroup === 'Group A' ? 'default' : 'outline'}
                onClick={() => setSelectedGroup('Group A')}
                className={selectedGroup === 'Group A' ? 'bg-[#23B685] hover:bg-[#23B685]/90' : ''}
              >
                Group A
              </Button>
              <Button
                size="sm"
                variant={selectedGroup === 'Group B' ? 'default' : 'outline'}
                onClick={() => setSelectedGroup('Group B')}
                className={selectedGroup === 'Group B' ? 'bg-[#23B685] hover:bg-[#23B685]/90' : ''}
              >
                Group B
              </Button>
              <Button
                size="sm"
                variant={selectedGroup === 'Group C' ? 'default' : 'outline'}
                onClick={() => setSelectedGroup('Group C')}
                className={selectedGroup === 'Group C' ? 'bg-[#23B685] hover:bg-[#23B685]/90' : ''}
              >
                Group C
              </Button>
            </div>
          )}

          <div className="space-y-3 mt-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onClick={() => setSelectedStudent(student)}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No students found for the selected filter
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <CoachKidModal
        kid={selectedStudent}
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </>
  );
}
