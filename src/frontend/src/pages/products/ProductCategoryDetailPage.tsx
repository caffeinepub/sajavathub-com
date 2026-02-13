import { useParams, Link } from '@tanstack/react-router';
import { useGetProductsByCategory, useGetProductCategories } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatINR } from '../../utils/format';

export default function ProductCategoryDetailPage() {
  const { categoryId } = useParams({ strict: false }) as { categoryId: string };
  const { data: products, isLoading: productsLoading, error: productsError } = useGetProductsByCategory(categoryId);
  const { data: categories, isLoading: categoriesLoading } = useGetProductCategories();

  const category = categories?.find((cat) => cat.id === categoryId);

  if (productsLoading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mb-8 h-10 w-48" />
        <div className="mb-8">
          <Skeleton className="mb-2 h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i}>
              <Skeleton className="h-64 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/products" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Link>
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

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/products" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Link>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Category Not Found</AlertTitle>
          <AlertDescription>
            The category you're looking for doesn't exist.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/products" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Categories
      </Link>

      <div className="mb-12">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">{category.name}</h1>
        <p className="text-lg text-muted-foreground">{category.description}</p>
      </div>

      {products && products.length === 0 ? (
        <div className="mx-auto max-w-md text-center">
          <p className="text-muted-foreground">No products available in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <Card key={product.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/generated/portfolio-1.dim_1200x800.png';
                  }}
                />
              </div>
              <CardHeader className="flex-1">
                <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  {product.priceINR && product.priceINR > 0n ? (
                    <span className="text-xl font-bold text-primary">{formatINR(product.priceINR)}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Price on request</span>
                  )}
                </div>
                <Button asChild className="w-full" variant="outline">
                  <a
                    href={product.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    View Product
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
