import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, ArrowLeft } from 'lucide-react';
import { mockKids, type SessionType } from './mockData';

const KidsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSession, setFilterSession] = useState<SessionType | 'all'>('all');

  const filteredKids = mockKids.filter(kid => {
    const matchesSearch = kid.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSession = filterSession === 'all' || kid.sessionType === filterSession;
    return matchesSearch && matchesSession;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-primary text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Coach Dashboard</h1>
              <p className="text-white/90">Manage your athletes and track their progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Card className="shadow-card border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search kids by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterSession} onValueChange={(value) => setFilterSession(value as SessionType | 'all')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="group">Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{mockKids.length}</div>
              <div className="text-sm text-muted-foreground">Total Kids</div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-success">
                {mockKids.filter(k => k.sessionType === 'individual').length}
              </div>
              <div className="text-sm text-muted-foreground">Individual Sessions</div>
            </CardContent>
          </Card>
          <Card className="shadow-card border-0">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-warning">
                {mockKids.filter(k => k.sessionType === 'group').length}
              </div>
              <div className="text-sm text-muted-foreground">Group Sessions</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKids.map((kid, index) => (
            <Card 
              key={kid.id} 
              className="shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate(`/coach/kid/${kid.id}`)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <img 
                    src={kid.avatarUrl} 
                    alt={kid.name}
                    className="w-16 h-16 rounded-full border-2 border-primary"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{kid.name}</CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge 
                        variant={kid.sessionType === 'individual' ? 'default' : 'secondary'}
                        className={kid.sessionType === 'individual' ? 'bg-primary' : 'bg-warning'}
                      >
                        {kid.sessionType}
                      </Badge>
                      {kid.achievedMilestones && kid.achievedMilestones.length > 0 && (
                        <Badge variant="outline" className="border-success text-success">
                          {kid.achievedMilestones.length} milestones
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Age:</span>
                    <span className="font-medium text-foreground">{kid.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gender:</span>
                    <span className="font-medium text-foreground capitalize">{kid.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium text-foreground">{kid.location}</span>
                  </div>
                  {kid.totalSessions && (
                    <div className="flex justify-between pt-2 border-t">
                      <span>Total Sessions:</span>
                      <span className="font-bold text-primary">{kid.totalSessions}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredKids.length === 0 && (
          <Card className="shadow-card border-0 mt-6">
            <CardContent className="py-12 text-center text-muted-foreground">
              No kids found matching your search criteria
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KidsList;
