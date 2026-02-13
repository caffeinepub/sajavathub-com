import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useOnboardingStore } from '../../state/onboardingStore';
import { useCreateProjectBrief } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { formatINR } from '../../utils/format';
import { toast } from 'sonner';
import { useState } from 'react';
import type { StylePreference, RoomType } from '../../backend';

function getStyleLabel(style: StylePreference): string {
  if ('__kind__' in style) {
    const labels: Record<string, string> = {
      modern: 'Modern',
      traditional: 'Traditional',
      contemporary: 'Contemporary',
      boho: 'Boho',
      minimalist: 'Minimalist',
      rustic: 'Rustic',
    };
    return labels[style.__kind__] || style.__kind__;
  }
  return 'Other';
}

function getRoomLabel(room: RoomType): string {
  if ('__kind__' in room) {
    const labels: Record<string, string> = {
      livingRoom: 'Living Room',
      bedroom: 'Bedroom',
      diningRoom: 'Dining Room',
      office: 'Home Office',
      kidsRoom: "Kids' Room",
    };
    return labels[room.__kind__] || room.__kind__;
  }
  return 'Other';
}

export default function ProjectBriefReviewPage() {
  const navigate = useNavigate();
  const { identity, login } = useInternetIdentity();
  const { roomType, stylePreferences, budget, timeline, selectedPackage, reset } =
    useOnboardingStore();
  const createBrief = useCreateProjectBrief();
  const [submitted, setSubmitted] = useState(false);

  const isAuthenticated = !!identity;

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to submit your project brief');
      await login();
      return;
    }

    if (!roomType || !budget || !timeline) {
      toast.error('Please complete all quiz steps');
      navigate({ to: '/onboarding/quiz' });
      return;
    }

    try {
      const briefId = `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await createBrief.mutateAsync({
        id: briefId,
        userId: identity.getPrincipal(),
        roomType,
        stylePreferences,
        budget,
        timeline,
        selectedPackage: selectedPackage || undefined,
        submissionDate: BigInt(Date.now() * 1000000),
        status: 'Submitted',
      });
      setSubmitted(true);
      toast.success('Project brief submitted successfully!');
    } catch (error) {
      console.error('Failed to submit brief:', error);
      toast.error('Failed to submit project brief. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">Project Brief Submitted!</h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Your project brief has been successfully submitted. Visit your dashboard to track
            progress and connect with designers.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={() => {
                reset();
                navigate({ to: '/app/dashboard' });
              }}
            >
              Go to Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                reset();
                navigate({ to: '/' });
              }}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!roomType || !budget || !timeline) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold">Incomplete Quiz</h1>
          <p className="mb-8 text-muted-foreground">
            Please complete the style quiz before reviewing your project brief.
          </p>
          <Button onClick={() => navigate({ to: '/onboarding/quiz' })}>Start Quiz</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" onClick={() => navigate({ to: '/onboarding/quiz' })} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quiz
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Review Your Project Brief</CardTitle>
            <CardDescription>
              Review your selections before submitting. You can go back to make changes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isAuthenticated && (
              <Alert>
                <AlertDescription>
                  You'll need to sign in to submit your project brief and access your dashboard.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h3 className="mb-2 font-semibold">Room Type</h3>
              <p className="text-muted-foreground">{getRoomLabel(roomType)}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Style Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {stylePreferences.map((style, idx) => (
                  <Badge key={idx} variant="secondary">
                    {getStyleLabel(style)}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Budget Range</h3>
              <p className="text-muted-foreground">
                {formatINR(budget.min)} - {formatINR(budget.max)}
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold">Timeline</h3>
              <p className="text-muted-foreground">{timeline}</p>
            </div>

            {selectedPackage && (
              <div>
                <h3 className="mb-2 font-semibold">Selected Package</h3>
                <Badge>{selectedPackage}</Badge>
              </div>
            )}

            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              <Button
                onClick={handleSubmit}
                disabled={createBrief.isPending}
                className="flex-1"
                size="lg"
              >
                {createBrief.isPending ? 'Submitting...' : 'Submit Project Brief'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/onboarding/quiz' })}
                className="flex-1"
                size="lg"
              >
                Edit Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
