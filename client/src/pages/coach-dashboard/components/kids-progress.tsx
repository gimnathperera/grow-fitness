import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { BadgeCheck, Award } from 'lucide-react';

interface Kid {
  id: string;
  name: string;
  age: number;
  achievements: string[];
}

const kids: Kid[] = [
  { id: '1', name: 'Emma', age: 6, achievements: [] },
  { id: '2', name: 'Liam', age: 9, achievements: ['Milestone 1'] },
];

const milestones = [
  {
    id: 1,
    title: 'Milestone 1',
    fitness: '20 Jumping Jacks (Age 4-8) / Plank 1.30min (9+)',
    wellness: 'Drink 3–5 glasses/day for 3 days',
    nutrition: 'Meal plan done OR No junk 2–3 days',
  },
  {
    id: 2,
    title: 'Milestone 2',
    fitness: '45s plank (Age 4-8) / Wall Sit 1.30min (9+)',
    wellness: 'Early bedtime 3 nights',
    nutrition: 'Meal plan week 1 & 2 OR 1 fruit/day',
  },
  {
    id: 3,
    title: 'Milestone 3',
    fitness: '10 Kneeling Pushups (Age 4-8) / 10 Pushups (9+)',
    wellness: 'Reduce & track screen time',
    nutrition: 'Meal plan weeks 1–3 OR eat 2–5 dates daily',
  },
];

export default function CoachBadges() {
  const [selectedKid, setSelectedKid] = useState<Kid | null>(kids[0]);

  const handleAward = (milestone: string) => {
    if (!selectedKid) return;
    if (!selectedKid.achievements.includes(milestone)) {
      setSelectedKid({
        ...selectedKid,
        achievements: [...selectedKid.achievements, milestone],
      });
    }
  };

  const totalMilestones = milestones.length;
  const completedMilestones = selectedKid?.achievements.length || 0;
  const progress = (completedMilestones / totalMilestones) * 100;

  return (
    <div className="p-6 grid gap-6 md:grid-cols-[300px_1fr]">
      {/* Kid Selector */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Kids</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {kids.map(kid => (
            <button
              key={kid.id}
              onClick={() => setSelectedKid(kid)}
              className={`flex items-center gap-3 w-full p-2 rounded-xl border transition ${
                selectedKid?.id === kid.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Avatar>
                <AvatarFallback>{kid.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-medium">{kid.name}</span>
                <span className="text-sm text-muted-foreground">
                  Age {kid.age}
                </span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Milestones + Progress */}
      <div className="space-y-6">
        {selectedKid && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {selectedKid.name}’s Progress
              </h2>
              <span className="text-sm font-medium text-muted-foreground">
                {completedMilestones}/{totalMilestones} milestones
              </span>
            </div>

            {/* Progress Bar */}
            <Progress value={progress} className="mb-6 h-3 rounded-full" />

            <div className="grid gap-4 md:grid-cols-2">
              {milestones.map(m => {
                const isCompleted = selectedKid.achievements.includes(m.title);
                return (
                  <Card
                    key={m.id}
                    className={`relative ${
                      isCompleted ? 'border-green-400 shadow-lg' : ''
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {m.title}
                        {isCompleted && (
                          <BadgeCheck className="text-green-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Fitness:</span>{' '}
                        {m.fitness}
                      </p>
                      <p>
                        <span className="font-medium">Wellness:</span>{' '}
                        {m.wellness}
                      </p>
                      <p>
                        <span className="font-medium">Nutrition:</span>{' '}
                        {m.nutrition}
                      </p>

                      {!isCompleted && (
                        <Button
                          size="sm"
                          className="mt-3"
                          onClick={() => handleAward(m.title)}
                        >
                          <Award className="w-4 h-4 mr-2" /> Award Badge
                        </Button>
                      )}
                      {isCompleted && (
                        <p className="mt-3 text-green-600 font-medium">
                          🎉 Completed
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
