import { useParams, Link } from '@tanstack/react-router';
import { useGetProductsByBrand, useGetProductBrands } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { formatINR } from '../../utils/format';
import SafeExternalImage from '../../components/products/SafeExternalImage';
import AddToCartButton from '../../components/cart/AddToCartButton';

export default function ProductBrandDetailPage() {
  const { brandId } = useParams({ strict: false }) as { brandId: string };
  const { data: products, isLoading: productsLoading, error: productsError } = useGetProductsByBrand(brandId);
  const { data: brands, isLoading: brandsLoading, isFetched: brandsFetched } = useGetProductBrands();

  const brand = brands?.find((b) => b.id === brandId);

  if (productsLoading || brandsLoading) {
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
        <Link to="/products/brands" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Brands
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

  if (brandsFetched && !brand) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/products/brands" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Brands
        </Link>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Brand Not Found</AlertTitle>
          <AlertDescription>
            The brand you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/products/brands" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Brands
        </Link>
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">{brand?.name}</h1>
          <p className="text-lg text-muted-foreground">{brand?.description}</p>
        </div>
        <div className="mx-auto max-w-md text-center">
          <p className="text-muted-foreground">No products available from this brand at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/products/brands" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Brands
      </Link>

      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">{brand?.name}</h1>
        <p className="text-lg text-muted-foreground">{brand?.description}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="group flex flex-col overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-square overflow-hidden bg-muted">
              <SafeExternalImage
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <CardHeader className="flex-1">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-primary">{formatINR(Number(product.priceINR))}</span>
                <span className="text-sm text-muted-foreground">
                  {Number(product.inventory) > 0 ? `${product.inventory} in stock` : 'Out of stock'}
                </span>
              </div>
              <AddToCartButton product={product} variant="outline" className="w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
