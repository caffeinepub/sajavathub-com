import { useParams } from '@tanstack/react-router';
import { useGetProductsByCategory } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ProductListingCard from '../../components/products/ProductListingCard';
import BackButton from '../../components/navigation/BackButton';

export default function ProductCategoryDetailPage() {
  const { categoryId } = useParams({ strict: false }) as { categoryId: string };
  const { data: products, isLoading, error } = useGetProductsByCategory(categoryId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/products" className="mb-8" />
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/products" className="mb-8" />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load products. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/products" className="mb-8" />
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            {categoryId}
          </h1>
        </div>
        <Alert>
          <AlertDescription>
            No products available in this category at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/products" className="mb-8" />
      
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          {categoryId}
        </h1>
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
