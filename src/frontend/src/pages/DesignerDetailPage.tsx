import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useGetDesigners } from '../hooks/useQueries';
import SafeExternalImage from '../components/products/SafeExternalImage';
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

export default function DesignerDetailPage() {
  const { designerId } = useParams({ strict: false }) as { designerId: string };
  const { data: designers, isLoading } = useGetDesigners();

  const designer = designers?.find((d) => d.id === designerId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading designer profile...</p>
        </div>
      </div>
    );
  }

  if (!designer) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Link to="/designers" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Designers
        </Link>
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Designer Not Found</h1>
          <p className="text-muted-foreground">The designer you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const portfolioImages = designer.portfolio.length > 0
    ? designer.portfolio
    : [
        { id: '1', imageUrl: '/assets/generated/portfolio-1.dim_1200x800.png', style: { __kind__: 'modern' } as StylePreference, description: 'Portfolio sample' },
        { id: '2', imageUrl: '/assets/generated/portfolio-2.dim_1200x800.png', style: { __kind__: 'contemporary' } as StylePreference, description: 'Portfolio sample' },
        { id: '3', imageUrl: '/assets/generated/portfolio-3.dim_1200x800.png', style: { __kind__: 'minimalist' } as StylePreference, description: 'Portfolio sample' },
      ];

  return (
    <div className="flex flex-col">
      <section className="relative">
        <div className="aspect-[21/9] w-full overflow-hidden bg-muted">
          <SafeExternalImage
            src={portfolioImages[0].imageUrl}
            alt={`${designer.name}'s work`}
            className="h-full w-full object-cover"
            fallbackSrc="/assets/generated/portfolio-1.dim_1200x800.png"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </section>

      <section className="container mx-auto px-4 py-12">
        <Link to="/designers" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Designers
        </Link>

        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="mb-4 text-4xl font-bold">{designer.name}</h1>
            <p className="mb-6 text-lg text-muted-foreground">{designer.bio}</p>
            <div className="flex flex-wrap gap-2">
              {designer.styles.map((style, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {getStyleLabel(style)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-start">
            <Button asChild size="lg" className="w-full lg:w-auto">
              <Link to="/onboarding/quiz">Get Started with {designer.name.split(' ')[0]}</Link>
            </Button>
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-2xl font-bold">Portfolio</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioImages.map((item) => (
              <div key={item.id} className="group overflow-hidden rounded-lg">
                <SafeExternalImage
                  src={item.imageUrl}
                  alt={item.description}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackSrc="/assets/generated/portfolio-1.dim_1200x800.png"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
