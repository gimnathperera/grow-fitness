import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { type Task } from './mockData';
import { Award, Calendar, Ruler, TrendingUp, Weight } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Student } from '@/types/dashboard';

interface CoachKidModalProps {
  kid: Student | null;
  open: boolean;
  onClose: () => void;
}

const CoachKidModal = ({ kid, open, onClose }: CoachKidModalProps) => {
const [tasks, setTasks] = useState<Task[]>(kid?.currentMilestone?.tasks || []);

  if (!kid) return null;

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId && task.type === 'fitness') {
          const newStatus = task.status === 'completed' ? 'pending' : 'completed';
          if (newStatus === 'completed') {
            toast.success(`${task.title} marked as completed!`, {
              position: 'top-right',
              autoClose: 3000,
              theme: 'colored',
            });
          } else {
            toast.info(`${task.title} reopened.`, {
              position: 'top-right',
              autoClose: 3000,
              theme: 'light',
            });
          }

          return {
            ...task,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return task;
      })
    );
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full overflow-y-auto">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{kid.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Sessions</span>
                </div>
                <div className="text-2xl font-bold text-primary">{kid.totalSessions || 'N/A'}</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-sm text-muted-foreground">BMI</span>
                </div>
               <div className="text-2xl font-bold text-success">{kid.bmi || 'N/A'}</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Ruler className="w-4 h-4 text-warning" />
                  <span className="text-sm text-muted-foreground">Height</span>
                </div>
                <div className="text-2xl font-bold text-warning">{kid.height || 'N/A'} cm</div>
              </CardContent>
            </Card>
            <Card className="shadow-card border-0">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-1">
                  <Weight className="w-4 h-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Weight</span>
                </div>
                <div className="text-2xl font-bold text-accent">{kid.weight || 'N/A'} kg</div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Current Milestone: {kid.currentMilestone?.name}
                </CardTitle>
                <Badge variant="outline">
                  {completedTasks}/{totalTasks} Tasks
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map(task => (
                  <Card
                    key={task.id}
                    className={`border-2 transition-all ${
                      task.status === 'completed'
                        ? 'border-success bg-success/5'
                        : 'border-border'
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        {task.type === 'fitness' ? (
                          <Checkbox
                            checked={task.status === 'completed'}
                            onCheckedChange={() => handleToggleTask(task.id)}
                            className="mt-1"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded border-2 mt-1 bg-muted" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={
                                task.type === 'fitness'
                                  ? 'border-primary text-primary'
                                  : task.type === 'wellness'
                                  ? 'border-accent text-accent'
                                  : 'border-warning text-warning'
                              }
                            >
                              {task.type}
                            </Badge>
                            {task.status === 'completed' && (
                              <Badge className="bg-success">Completed</Badge>
                            )}
                          </div>
                          <h4 className="font-semibold mb-1">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          {task.type !== 'fitness' && (
                            <p className="text-xs text-muted-foreground mt-2">
                              ⚠️ Parent will mark this task
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoachKidModal;
