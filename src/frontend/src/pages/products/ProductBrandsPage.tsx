import { Link } from '@tanstack/react-router';
import { useGetProductBrands } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Store } from 'lucide-react';
import BackButton from '../../components/navigation/BackButton';

export default function ProductBrandsPage() {
  const { data: brands, isLoading, error } = useGetProductBrands();

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/shop" />

      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Shop by Brand</h1>
        <p className="text-lg text-muted-foreground">
          Explore products from your favorite brands
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load brands'}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brands && brands.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.map((brand) => (
            <Link key={brand.id} to="/shop/brands/$brandId" params={{ brandId: brand.id }}>
              <Card className="group cursor-pointer transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 flex h-16 items-center justify-center rounded-lg bg-muted">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="max-h-12 max-w-full object-contain"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="text-center group-hover:text-primary">
                    {brand.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-sm text-muted-foreground">
                    {brand.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No brands available</p>
        </div>
      )}
    </div>
  );
}
