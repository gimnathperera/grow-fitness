import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateCoachProfileMutation } from '@/services/coachesApi';
import { useNavigate } from 'react-router-dom';

export function NoCoachProfile() {
  const [createCoachProfile, { isLoading }] = useCreateCoachProfileMutation();
  const navigate = useNavigate();

  const handleCreateProfile = async () => {
    try {
      await createCoachProfile({
        status: 'active',
        specialization: 'General Fitness',
        // Add any other default values you want to set
      }).unwrap();
      // Refresh the page to load the new profile
      navigate(0);
    } catch (error) {
      console.error('Failed to create coach profile:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Your Coach Dashboard</CardTitle>
          <CardDescription>
            It looks like you don't have a coach profile yet. Let's create one to get started!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            As a coach, you'll be able to manage your schedule, track client progress, and more.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleCreateProfile} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create My Coach Profile'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
