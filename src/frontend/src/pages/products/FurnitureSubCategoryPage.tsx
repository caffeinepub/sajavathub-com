import { useParams } from '@tanstack/react-router';
import { useGetProductsByFurnitureSubCategory } from '../../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { FurnitureSubCategory } from '../../backend';
import ProductListingCard from '../../components/products/ProductListingCard';
import BackButton from '../../components/navigation/BackButton';
import { applyFurnitureImageOverrides } from '../../data/furnitureImageOverrides';

export default function FurnitureSubCategoryPage() {
  const { subCategory } = useParams({ from: '/shop/furniture/$subCategory' });
  const { data: products, isLoading, error } = useGetProductsByFurnitureSubCategory(subCategory as FurnitureSubCategory);

  const productsWithImages = products ? applyFurnitureImageOverrides(products, subCategory as FurnitureSubCategory) : [];

  const subCategoryLabels: Record<FurnitureSubCategory, string> = {
    [FurnitureSubCategory.sofa]: 'Sofas',
    [FurnitureSubCategory.centerTable]: 'Center Tables',
    [FurnitureSubCategory.diningTable]: 'Dining Tables',
    [FurnitureSubCategory.cornerTable]: 'Corner Tables',
    [FurnitureSubCategory.kingSizeBed]: 'King Size Beds',
    [FurnitureSubCategory.queenSizeBed]: 'Queen Size Beds',
    [FurnitureSubCategory.bedSideTables]: 'Bedside Tables',
    [FurnitureSubCategory.dressingTable]: 'Dressing Tables',
    [FurnitureSubCategory.studyTable]: 'Study Tables',
    [FurnitureSubCategory.sofaChairs]: 'Sofa Chairs',
    [FurnitureSubCategory.recliners]: 'Recliners',
    [FurnitureSubCategory.crockeryUnit]: 'Crockery Units',
  };

  const label = subCategoryLabels[subCategory as FurnitureSubCategory] || subCategory;

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/shop/furniture" />

      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">{label}</h1>
        <p className="text-lg text-muted-foreground">
          Browse our collection of {label.toLowerCase()}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load products'}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : productsWithImages && productsWithImages.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productsWithImages.map((product) => (
            <ProductListingCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No products found in this category</p>
        </div>
      )}
    </div>
  );
}
