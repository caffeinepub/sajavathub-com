import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useGetPackages } from '../hooks/useQueries';
import { formatINR } from '../utils/format';
import { useOnboardingStore } from '../state/onboardingStore';

export default function PackagesPage() {
  const { data: packages, isLoading } = useGetPackages();
  const setSelectedPackage = useOnboardingStore((state) => state.setSelectedPackage);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading packages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Design Packages</h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Choose the perfect package for your interior design needs. All packages include
              personalized service from expert designers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {packages && packages.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, index) => (
                <Card
                  key={pkg.id}
                  className={`relative flex flex-col ${
                    index === 1 ? 'border-2 border-primary shadow-lg' : ''
                  }`}
                >
                  {index === 1 && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <CardDescription>{pkg.description}</CardDescription>
                    <div className="pt-4">
                      <div className="text-4xl font-bold">{formatINR(pkg.priceINR)}</div>
                      <p className="text-sm text-muted-foreground">per room</p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <CheckCircle className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="mt-8 w-full" variant={index === 1 ? 'default' : 'outline'}>
                      <Link
                        to="/onboarding/quiz"
                        onClick={() => handleSelectPackage(pkg.id)}
                      >
                        Get Started <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">No packages available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Not Sure Which Package to Choose?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Take our style quiz to get personalized package recommendations based on your needs and
              budget.
            </p>
            <Button asChild size="lg">
              <Link to="/onboarding/quiz">
                Take the Quiz <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
