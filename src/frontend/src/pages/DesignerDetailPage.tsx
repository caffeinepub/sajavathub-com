import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useGetDesigners } from '../hooks/useQueries';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SafeExternalImage from '../components/products/SafeExternalImage';

export default function DesignerDetailPage() {
  const { designerId } = useParams({ from: '/designers/$designerId' });
  const { data: designers, isLoading, error } = useGetDesigners();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Skeleton className="mb-4 h-12 w-64" />
          <Skeleton className="mb-2 h-6 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-video w-full" />
          ))}
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
            Failed to load designer information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const designer = designers?.find((d) => d.id === designerId);

  if (!designer) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            Designer not found. Please check the URL or browse our{' '}
            <Link to="/designers" className="underline">
              designer directory
            </Link>
            .
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatStyleName = (style: any): string => {
    if (typeof style === 'object' && style !== null) {
      const key = Object.keys(style)[0];
      if (key === 'other' && typeof style[key] === 'string') {
        return style[key];
      }
      return key.charAt(0).toUpperCase() + key.slice(1);
    }
    return String(style);
  };

  const handleStartProject = () => {
    navigate({ to: '/quiz', search: { designerId: designer.id } });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-serif mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {designer.name}
            </h1>
            <div className="mb-6 flex flex-wrap gap-2">
              {designer.styles.map((style, index) => (
                <Badge key={index} variant="secondary" className="text-base px-4 py-1">
                  {formatStyleName(style)}
                </Badge>
              ))}
            </div>
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed md:text-xl">
              {designer.bio}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" onClick={handleStartProject} className="text-lg px-8 py-6">
                Work with {designer.name.split(' ')[0]} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link to="/quiz">Start Style Quiz</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="font-serif mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Portfolio
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore {designer.name.split(' ')[0]}'s recent design work
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {designer.portfolio.map((item) => (
              <Card key={item.id} className="group overflow-hidden border-2">
                <div className="aspect-video overflow-hidden">
                  <SafeExternalImage
                    src={item.imageUrl}
                    alt={item.description}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <CardHeader>
                  <div className="mb-2">
                    <Badge variant="secondary">{formatStyleName(item.style)}</Badge>
                  </div>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="p-12 text-center md:p-16">
              <h2 className="font-serif mb-4 text-3xl font-bold md:text-4xl">
                Ready to Start Your Project?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground max-w-2xl mx-auto">
                Begin your design journey with {designer.name.split(' ')[0]} by taking our quick style quiz
              </p>
              <Button size="lg" onClick={handleStartProject} className="text-lg px-8 py-6">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
