import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useGetDesigners } from '../hooks/useQueries';
import type { StylePreference } from '../backend';

const stylePreferenceLabels: Record<string, string> = {
  modern: 'Modern',
  traditional: 'Traditional',
  contemporary: 'Contemporary',
  boho: 'Boho',
  minimalist: 'Minimalist',
  rustic: 'Rustic',
};

function getStyleLabel(style: StylePreference): string {
  if ('__kind__' in style) {
    return stylePreferenceLabels[style.__kind__] || style.__kind__;
  }
  return 'Other';
}

const placeholderImages = [
  '/assets/generated/portfolio-1.dim_1200x800.png',
  '/assets/generated/portfolio-2.dim_1200x800.png',
  '/assets/generated/portfolio-3.dim_1200x800.png',
];

export default function DesignerDetailPage() {
  const { designerId } = useParams({ from: '/designers/$designerId' });
  const { data: designers, isLoading } = useGetDesigners();

  const designer = designers?.find((d) => d.id === designerId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading designer...</p>
        </div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Designer Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The designer you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/designers">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Designers
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const portfolioImages =
    designer.portfolio.length > 0
      ? designer.portfolio.map((item) => item.imageUrl)
      : placeholderImages;

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/designers">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Designers
            </Link>
          </Button>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h1 className="mb-4 text-4xl font-bold">{designer.name}</h1>
              <div className="mb-6 flex flex-wrap gap-2">
                {designer.styles.map((style, idx) => (
                  <Badge key={idx} variant="secondary">
                    {getStyleLabel(style)}
                  </Badge>
                ))}
              </div>
              <p className="text-lg text-muted-foreground">{designer.bio}</p>
            </div>
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img
                src={portfolioImages[0]}
                alt={designer.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Portfolio</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {portfolioImages.map((imageUrl, idx) => (
              <Card key={idx} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt={`Portfolio ${idx + 1}`}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  {designer.portfolio[idx] && (
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">
                        {designer.portfolio[idx].description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-3xl font-bold">Work with {designer.name}</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Start your interior design journey and get matched with expert designers.
              </p>
              <Button asChild size="lg">
                <Link to="/onboarding/quiz">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
