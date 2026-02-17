import { Link } from '@tanstack/react-router';
import { useGetProductBrands } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BackButton from '../../components/navigation/BackButton';

export default function ProductBrandsPage() {
  const { data: brands, isLoading, error, isFetched } = useGetProductBrands();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/shop" className="mb-8" />
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-64" />
          <Skeleton className="mx-auto h-6 w-96" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/shop" className="mb-8" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load brands. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const sortedBrands = [...(brands || [])].sort((a, b) => a.name.localeCompare(b.name));

  if (isFetched && sortedBrands.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/shop" className="mb-8" />
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">Shop by Brand</h1>
          <p className="text-lg text-muted-foreground">
            Explore products from your favorite furniture brands
          </p>
        </div>
        <div className="mx-auto max-w-md text-center">
          <p className="text-muted-foreground">No brands available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/shop" className="mb-8" />
      
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">Shop by Brand</h1>
        <p className="text-lg text-muted-foreground">
          Explore products from your favorite furniture brands
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedBrands.map((brand) => (
          <Link key={brand.id} to="/products/brands/$brandId" params={{ brandId: brand.id }}>
            <Card className="group overflow-hidden transition-all hover:shadow-lg">
              <div className="flex aspect-video items-center justify-center bg-muted p-8">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground">{brand.name}</h3>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{brand.name}</CardTitle>
                <CardDescription className="line-clamp-2 text-base">{brand.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Products
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
