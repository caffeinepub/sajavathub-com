import { useParams } from '@tanstack/react-router';
import { useGetProductsByBrand, useGetProductBrands } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import BackButton from '../../components/navigation/BackButton';
import ProductListingCard from '../../components/products/ProductListingCard';

export default function ProductBrandDetailPage() {
  const { brandId } = useParams({ strict: false }) as { brandId: string };
  const { data: products, isLoading: productsLoading, error: productsError } = useGetProductsByBrand(brandId);
  const { data: brands, isLoading: brandsLoading, isFetched: brandsFetched } = useGetProductBrands();

  const brand = brands?.find((b) => b.id === brandId);

  if (productsLoading || brandsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/products/brands" className="mb-8" />
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/products/brands" className="mb-8" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load brand products. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (brandsFetched && !brand) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/products/brands" className="mb-8" />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Brand Not Found</AlertTitle>
          <AlertDescription>
            The requested brand could not be found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/products/brands" className="mb-8" />
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            {brand?.name || brandId}
          </h1>
          {brand?.description && (
            <p className="text-muted-foreground">{brand.description}</p>
          )}
        </div>
        <Alert>
          <AlertDescription>
            No products available from this brand at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/products/brands" className="mb-8" />
      
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          {brand?.name || brandId}
        </h1>
        {brand?.description && (
          <p className="mb-4 text-muted-foreground">{brand.description}</p>
        )}
        <p className="text-muted-foreground">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductListingCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
