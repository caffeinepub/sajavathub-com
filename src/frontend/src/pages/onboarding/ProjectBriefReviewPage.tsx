import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, Edit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useOnboardingStore } from '../../state/onboardingStore';
import { useCreateProjectBrief } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { formatINR } from '../../utils/format';
import type { ProjectBrief } from '../../backend';

export default function ProjectBriefReviewPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { roomType, stylePreferences, budget, timeline, selectedPackage, setLastSubmittedBriefId } = useOnboardingStore();
  const createBrief = useCreateProjectBrief();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to submit your project brief and connect with designers.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => navigate({ to: '/quiz' })}>Start Quiz</Button>
        </div>
      </div>
    );
  }

  if (!roomType || stylePreferences.length === 0 || !budget) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Incomplete Quiz</AlertTitle>
          <AlertDescription>
            Please complete the style quiz before reviewing your project brief.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => navigate({ to: '/quiz' })}>Start Quiz</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!identity || !budget) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const briefId = `brief-${Date.now()}`;
      const brief: ProjectBrief = {
        id: briefId,
        userId: identity.getPrincipal(),
        roomType,
        stylePreferences,
        budget: {
          min: budget.min,
          max: budget.max,
          currency: 'INR',
        },
        timeline,
        selectedPackage: selectedPackage || undefined,
        submissionDate: BigInt(Date.now() * 1000000),
        status: 'pending',
      };

      await createBrief.mutateAsync(brief);
      setLastSubmittedBriefId(briefId);
      
      // Navigate to designer matching page
      navigate({ to: '/matching' });
    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitError(error.message || 'Failed to submit project brief');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRoomType = (rt: any): string => {
    if (typeof rt === 'object' && rt !== null) {
      const key = Object.keys(rt)[0];
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    }
    return String(rt);
  };

  const formatStyle = (style: any): string => {
    if (typeof style === 'object' && style !== null) {
      const key = Object.keys(style)[0];
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
    return String(style);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate({ to: '/quiz' })} className="mb-6">
          <Edit className="mr-2 h-4 w-4" />
          Edit Answers
        </Button>
        <h1 className="font-serif mb-2 text-3xl font-bold tracking-tight text-foreground">
          Review Your Project Brief
        </h1>
        <p className="text-lg text-muted-foreground">
          Please review your answers before submitting
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Room Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="text-base">
              {formatRoomType(roomType)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Style Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stylePreferences.map((style, index) => (
                <Badge key={index} variant="secondary" className="text-base">
                  {formatStyle(style)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Range</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {formatINR(budget.min)} - {formatINR(budget.max)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{timeline}</p>
          </CardContent>
        </Card>

        {selectedPackage && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Package</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="default" className="text-base">
                {selectedPackage}
              </Badge>
            </CardContent>
          </Card>
        )}

        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/quiz' })}
            className="flex-1"
          >
            Edit
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Submitting...' : 'Submit & Find Designers'}
          </Button>
        </div>
      </div>
    </div>
  );
}
