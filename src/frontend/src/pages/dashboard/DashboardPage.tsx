import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowRight } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetUserProjectBriefs } from '../../hooks/useQueries';
import { formatDate } from '../../utils/format';
import ConsultationRequestForm from '../../components/dashboard/ConsultationRequestForm';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const userId = identity?.getPrincipal().toString() || '';
  const { data: briefs, isLoading } = useGetUserProjectBriefs(userId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Manage your interior design projects</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Projects</h2>
            <Button asChild>
              <Link to="/onboarding/quiz">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>

          {briefs && briefs.length > 0 ? (
            <div className="space-y-4">
              {briefs.map((brief) => (
                <Card key={brief.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>
                          {'__kind__' in brief.roomType
                            ? brief.roomType.__kind__.replace(/([A-Z])/g, ' $1').trim()
                            : 'Room'}{' '}
                          Design
                        </CardTitle>
                        <CardDescription>
                          Created on {formatDate(brief.submissionDate)}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          brief.status === 'Submitted'
                            ? 'default'
                            : brief.status === 'In Review'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {brief.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Timeline: {brief.timeline}
                      </div>
                      <Button asChild variant="ghost">
                        <Link to="/app/projects/$projectId" params={{ projectId: brief.id }}>
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="mb-4 text-muted-foreground">
                  You don't have any projects yet. Start by creating your first project brief.
                </p>
                <Button asChild>
                  <Link to="/onboarding/quiz">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project Brief
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <ConsultationRequestForm />
        </div>
      </div>
    </div>
  );
}
