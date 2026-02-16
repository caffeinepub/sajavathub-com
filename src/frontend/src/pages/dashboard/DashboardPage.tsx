import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetUserProjectBriefs } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Plus } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatDate } from '../../utils/format';
import ConsultationRequestForm from '../../components/dashboard/ConsultationRequestForm';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() || '';
  const { data: briefs, isLoading, error } = useGetUserProjectBriefs(userId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mb-8 h-12 w-64" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load your projects. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const noBriefs = !briefs || briefs.length === 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage your design projects and consultations</p>
      </div>

      {noBriefs ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-semibold">No Projects Yet</h2>
            <p className="mb-6 text-muted-foreground">
              Start your interior design journey by taking our style quiz.
            </p>
            <Button asChild size="lg">
              <Link to="/quiz">
                <Plus className="mr-2 h-5 w-5" />
                Start New Project
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Projects</CardTitle>
                <CardDescription>View and manage your design projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {briefs.map((brief) => (
                    <Card key={brief.id} className="transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {brief.roomType && typeof brief.roomType === 'object'
                                ? Object.keys(brief.roomType)[0]
                                : 'Project'}
                            </CardTitle>
                            <CardDescription>
                              Created {formatDate(brief.submissionDate)}
                            </CardDescription>
                          </div>
                          <Badge variant={brief.status === 'active' ? 'default' : 'secondary'}>
                            {brief.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link to="/projects/$projectId" params={{ projectId: brief.id }}>
                          <Button variant="outline" className="w-full">
                            View Project
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/quiz">
                      <Plus className="mr-2 h-4 w-4" />
                      Start New Project
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <ConsultationRequestForm />
          </div>
        </div>
      )}
    </div>
  );
}
