import { useParams, Link } from '@tanstack/react-router';
import { useGetDesigners } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SafeExternalImage from '../components/products/SafeExternalImage';

export default function DesignerDetailPage() {
  const { designerId } = useParams({ from: '/designers/$designerId' });
  const { data: designers, isLoading, error } = useGetDesigners();

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">{designer.name}</h1>
        <div className="mb-4 flex flex-wrap gap-2">
          {designer.styles.map((style, index) => (
            <Badge key={index} variant="secondary">
              {formatStyleName(style)}
            </Badge>
          ))}
        </div>
        <p className="mb-6 text-lg text-muted-foreground">{designer.bio}</p>
        <Button asChild size="lg">
          <Link to="/quiz">Get Started with {designer.name.split(' ')[0]}</Link>
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Portfolio</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {designer.portfolio.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <SafeExternalImage
                  src={item.imageUrl}
                  alt={item.description}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{formatStyleName(item.style)}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
