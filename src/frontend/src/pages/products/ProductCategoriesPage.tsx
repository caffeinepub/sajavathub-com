import { Link } from '@tanstack/react-router';
import { useGetProductCategories } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProductCategoriesPage() {
  const { data: categories, isLoading, error, isFetched } = useGetProductCategories();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-64" />
          <Skeleton className="mx-auto h-6 w-96" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-64 w-full rounded-t-lg" />
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load product categories. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const sortedCategories = [...(categories || [])].sort((a, b) => {
    const aOrder = a.id.split('-').length;
    const bOrder = b.id.split('-').length;
    return aOrder - bOrder;
  });

  if (isFetched && sortedCategories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">Shop by Category</h1>
          <p className="text-lg text-muted-foreground">
            Discover curated furniture and decor for every room
          </p>
        </div>
        <div className="mx-auto max-w-md text-center">
          <p className="text-muted-foreground">No categories available at the moment.</p>
        </div>
      </div>
    );
  }

  // Helper function to get category image based on category name or description
  const getCategoryImage = (category: { id: string; name: string; description: string }) => {
    const name = category.name.toLowerCase();
    const desc = category.description.toLowerCase();
    const id = category.id.toLowerCase();
    
    if (name.includes('living') || desc.includes('living room') || id.includes('living')) {
      return '/assets/generated/category-living-room.dim_800x800.png';
    }
    if (name.includes('bedroom') || desc.includes('bedroom') || id.includes('bedroom')) {
      return '/assets/generated/category-bedroom.dim_800x800.png';
    }
    if (name.includes('dining') || desc.includes('dining') || id.includes('dining')) {
      return '/assets/generated/category-dining.dim_800x800.png';
    }
    if (name.includes('office') || desc.includes('office') || id.includes('office')) {
      return '/assets/generated/category-office.dim_800x800.png';
    }
    // Home Decor category - accessories, wall art, decorative items
    if (
      name.includes('decor') || 
      desc.includes('decor') || 
      desc.includes('accessories') ||
      desc.includes('wall art') || 
      desc.includes('vase') ||
      desc.includes('beauty') ||
      id.includes('homedecor') ||
      id.includes('decor')
    ) {
      return '/assets/generated/category-decor-lighting.dim_800x800.png';
    }
    // Home Furnishing category - textiles, soft furnishings, curtains, rugs
    if (
      name.includes('furnishing') || 
      desc.includes('furnishing') ||
      desc.includes('curtains') || 
      desc.includes('rugs') || 
      desc.includes('textiles') ||
      desc.includes('cushion') ||
      desc.includes('functional') ||
      id.includes('homefurnishing') ||
      id.includes('furnishing')
    ) {
      return '/assets/generated/category-rugs-textiles.dim_800x800.png';
    }
    // Default fallback
    return '/assets/generated/category-rugs-textiles.dim_800x800.png';
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">Shop by Category</h1>
        <p className="text-lg text-muted-foreground">
          Discover curated furniture and decor for every room
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sortedCategories.map((category) => (
          <Link key={category.id} to="/products/$categoryId" params={{ categoryId: category.id }}>
            <Card className="group overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-square overflow-hidden">
                <img
                  src={getCategoryImage(category)}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{category.name}</CardTitle>
                <CardDescription className="text-base">{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Browse Collection
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
