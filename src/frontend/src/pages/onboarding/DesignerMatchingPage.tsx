import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { useOnboardingStore } from '../../state/onboardingStore';
import { useGetRecommendedDesigners, useSelectDesigner } from '../../hooks/useDesignerMatching';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import RecommendedDesignerCard from '../../components/matching/RecommendedDesignerCard';

export default function DesignerMatchingPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { roomType, stylePreferences, lastSubmittedBriefId } = useOnboardingStore();
  const [selectedDesignerId, setSelectedDesignerId] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionSuccess, setSelectionSuccess] = useState(false);

  const { data: designers, isLoading, error } = useGetRecommendedDesigners(roomType, stylePreferences);
  const selectDesigner = useSelectDesigner();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to view designer recommendations and start your project.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => navigate({ to: '/quiz' })}>Start Quiz</Button>
        </div>
      </div>
    );
  }

  const handleSelectDesigner = async (designerId: string) => {
    if (!lastSubmittedBriefId) {
      console.error('No brief ID available');
      return;
    }

    setIsSelecting(true);
    try {
      await selectDesigner.mutateAsync({
        briefId: lastSubmittedBriefId,
        designerId,
      });
      setSelectedDesignerId(designerId);
      setSelectionSuccess(true);
      setTimeout(() => {
        navigate({ to: '/dashboard' });
      }, 2000);
    } catch (error: any) {
      console.error('Selection error:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  if (selectionSuccess) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card className="border-2 border-primary">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="mb-4 h-16 w-16 text-primary" />
            <h2 className="mb-2 text-2xl font-semibold">Designer Selected!</h2>
            <p className="text-muted-foreground">
              Redirecting you to your dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-96" />
          <Skeleton className="mx-auto h-6 w-64" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="aspect-[4/3] w-full" />
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load designer recommendations. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="mt-6 text-center">
          <Button onClick={() => navigate({ to: '/dashboard' })}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (!designers || designers.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>No Recommendations Available</CardTitle>
            <CardDescription>
              We couldn't find designers matching your preferences at this time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Don't worry! You can browse our full designer directory and choose one that fits your style.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link to="/designers">Browse All Designers</Link>
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/dashboard' })}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-serif mb-4 text-4xl font-bold md:text-5xl">
          Your Designer Matches
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Based on your style preferences and project needs, we've found these talented designers for you
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {designers.map((designer) => (
          <RecommendedDesignerCard
            key={designer.id}
            designer={designer}
            onSelect={handleSelectDesigner}
            isSelecting={isSelecting && selectedDesignerId === designer.id}
            disabled={isSelecting}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="mb-4 text-muted-foreground">
          Want to see more options?
        </p>
        <Button asChild variant="outline" size="lg">
          <Link to="/designers">
            Browse All Designers <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
