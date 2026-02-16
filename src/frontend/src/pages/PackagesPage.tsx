import { Link } from '@tanstack/react-router';
import { useGetPackages } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatINR } from '../utils/format';
import PackagesInfoSections from '../components/packages/PackagesInfoSections';
import StylePackagesSection from '../components/packages/StylePackagesSection';

export default function PackagesPage() {
  const { data: packages, isLoading, error } = useGetPackages();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-64" />
          <Skeleton className="mx-auto h-6 w-96" />
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-4 h-24 w-full" />
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
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load packages. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Design Packages for Every Need
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Choose the perfect package for your interior design project. All packages include
            personalized design services tailored to Indian homes.
          </p>
          <Button asChild size="lg">
            <Link
              to="/quiz"
              className="inline-flex items-center"
            >
              Start Your Design Journey
            </Link>
          </Button>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 grid gap-8 md:grid-cols-3">
            {packages?.map((pkg) => (
              <Card
                key={pkg.id}
                className="flex flex-col transition-all hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-primary">
                    {formatINR(Number(pkg.priceINR))}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <p className="mb-6 text-muted-foreground">{pkg.description}</p>
                  <ul className="mb-6 flex-1 space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link to="/quiz">Choose {pkg.name}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Style Packages Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <StylePackagesSection />
        </div>
      </section>

      {/* Info Sections */}
      <PackagesInfoSections />
    </div>
  );
}
