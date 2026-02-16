import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package } from 'lucide-react';
import { useGetRoomPackagesByStyleAndRoomType, useGetProductsForRoomPackage } from '../../hooks/useQueries';
import { useCartStore } from '../../state/cartStore';
import { toast } from 'sonner';
import type { StylePreference, RoomType, RoomPackage as RoomPackageType } from '../../backend';
import RoomPackageList from './room-packages/RoomPackageList';
import RoomPackageDetailHeader from './room-packages/RoomPackageDetailHeader';
import IncludedProductsPanel from './room-packages/IncludedProductsPanel';
import RoomPackagesLoadingState from './room-packages/RoomPackagesLoadingState';
import ProductsLoadingState from './room-packages/ProductsLoadingState';

const styleOptions: { value: StylePreference; label: string }[] = [
  { value: { __kind__: 'modern', modern: null }, label: 'Modern' },
  { value: { __kind__: 'traditional', traditional: null }, label: 'Traditional' },
  { value: { __kind__: 'contemporary', contemporary: null }, label: 'Contemporary' },
  { value: { __kind__: 'boho', boho: null }, label: 'Bohemian' },
  { value: { __kind__: 'minimalist', minimalist: null }, label: 'Minimalist' },
  { value: { __kind__: 'rustic', rustic: null }, label: 'Rustic' },
];

const roomTypeOptions: { value: RoomType; label: string }[] = [
  { value: { __kind__: 'livingRoom', livingRoom: null }, label: 'Living Room' },
  { value: { __kind__: 'bedroom', bedroom: null }, label: 'Bedroom' },
  { value: { __kind__: 'diningRoom', diningRoom: null }, label: 'Dining Room' },
  { value: { __kind__: 'office', office: null }, label: 'Office' },
  { value: { __kind__: 'kidsRoom', kidsRoom: null }, label: 'Kids Room' },
];

export default function StylePackagesSection() {
  const [selectedStyle, setSelectedStyle] = useState<StylePreference | null>(null);
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null);
  const [selectedRoomPackageId, setSelectedRoomPackageId] = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data: packages, isLoading: packagesLoading } = useGetRoomPackagesByStyleAndRoomType(
    selectedStyle,
    selectedRoomType
  );

  const selectedPackage = packages?.find((pkg) => pkg.id === selectedRoomPackageId) || null;

  const { data: products, isLoading: productsLoading } = useGetProductsForRoomPackage(
    selectedRoomPackageId || ''
  );

  const { addItemBulk } = useCartStore();

  // Reset selected package when filters change
  useEffect(() => {
    setSelectedRoomPackageId(null);
  }, [selectedStyle, selectedRoomType]);

  // Auto-select first package when packages load
  useEffect(() => {
    if (packages && packages.length > 0 && !selectedRoomPackageId) {
      setSelectedRoomPackageId(packages[0].id);
    }
  }, [packages, selectedRoomPackageId]);

  const handleStyleChange = (value: string) => {
    const style = styleOptions.find((opt) => opt.label === value);
    if (style) {
      setSelectedStyle(style.value);
    }
  };

  const handleRoomTypeChange = (value: string) => {
    const roomType = roomTypeOptions.find((opt) => opt.label === value);
    if (roomType) {
      setSelectedRoomType(roomType.value);
    }
  };

  const handlePackageSelect = (pkg: RoomPackageType) => {
    setSelectedRoomPackageId(pkg.id);
  };

  const handleAddEntirePackageToCart = async () => {
    if (!products || products.length === 0) {
      toast.error('No products available in this package');
      return;
    }

    setIsAddingToCart(true);

    const results = addItemBulk(
      products.map((product) => ({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        priceINR: Number(product.priceINR),
        availableInventory: Number(product.inventory),
      }))
    );

    setIsAddingToCart(false);

    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    if (successCount > 0 && failedCount === 0) {
      toast.success(`All ${successCount} items added to cart!`);
    } else if (successCount > 0 && failedCount > 0) {
      toast.warning(`${successCount} items added to cart. ${failedCount} items could not be added due to stock limits.`);
    } else {
      toast.error('Could not add items to cart. Please check stock availability.');
    }
  };

  const getStyleLabel = (style: StylePreference): string => {
    return styleOptions.find((opt) => opt.value.__kind__ === style.__kind__)?.label || 'Unknown';
  };

  const getRoomTypeLabel = (roomType: RoomType): string => {
    return roomTypeOptions.find((opt) => opt.value.__kind__ === roomType.__kind__)?.label || 'Unknown';
  };

  return (
    <section className="bg-muted/20 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Style Packages</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse curated room packages by interior design style. Each package includes carefully selected furniture, furnishings, and decor that you can add to your cart with a single click.
          </p>
        </div>

        <div className="mx-auto max-w-7xl">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Your Style & Room</CardTitle>
              <CardDescription>
                Choose a design style and room type to see available packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Design Style</label>
                  <Select onValueChange={handleStyleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((option) => (
                        <SelectItem key={option.label} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Room Type</label>
                  <Select onValueChange={handleRoomTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypeOptions.map((option) => (
                        <SelectItem key={option.label} value={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {packagesLoading && <RoomPackagesLoadingState />}

          {!packagesLoading && selectedStyle && selectedRoomType && (!packages || packages.length === 0) && (
            <Card className="py-12">
              <CardContent className="text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  No packages available for this style and room combination yet.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try selecting a different style or room type.
                </p>
              </CardContent>
            </Card>
          )}

          {!packagesLoading && !selectedStyle && !selectedRoomType && (
            <Card className="py-12">
              <CardContent className="text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">
                  Select a design style and room type to view available packages.
                </p>
              </CardContent>
            </Card>
          )}

          {!packagesLoading && packages && packages.length > 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-semibold">Available Packages ({packages.length})</h3>
                <RoomPackageList
                  packages={packages}
                  selectedPackageId={selectedRoomPackageId}
                  onSelectPackage={handlePackageSelect}
                  getStyleLabel={getStyleLabel}
                  getRoomTypeLabel={getRoomTypeLabel}
                />
              </div>

              {selectedPackage && (
                <div className="space-y-6">
                  <RoomPackageDetailHeader
                    roomPackage={selectedPackage}
                    getStyleLabel={getStyleLabel}
                    getRoomTypeLabel={getRoomTypeLabel}
                    onAddToCart={handleAddEntirePackageToCart}
                    isAddingToCart={isAddingToCart}
                    hasProducts={!!products && products.length > 0}
                  />

                  {productsLoading && <ProductsLoadingState />}

                  {!productsLoading && products && products.length > 0 && (
                    <IncludedProductsPanel products={products} />
                  )}

                  {!productsLoading && (!products || products.length === 0) && (
                    <Card className="py-8">
                      <CardContent className="text-center">
                        <Package className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          No products found for this package.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
