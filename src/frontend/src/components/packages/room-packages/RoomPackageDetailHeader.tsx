import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { formatINR } from '../../../utils/format';
import QuantitySelector from '../../products/QuantitySelector';
import type { RoomPackage, StylePreference, RoomType, Product } from '../../../backend';
import { useState, useEffect } from 'react';

interface RoomPackageDetailHeaderProps {
  roomPackage: RoomPackage;
  getStyleLabel: (style: StylePreference) => string;
  getRoomTypeLabel: (roomType: RoomType) => string;
  onAddToCart: (quantity: number) => void;
  onBackToPackages: () => void;
  isAddingToCart: boolean;
  hasProducts: boolean;
  products?: Product[];
}

export default function RoomPackageDetailHeader({
  roomPackage,
  getStyleLabel,
  getRoomTypeLabel,
  onAddToCart,
  onBackToPackages,
  isAddingToCart,
  hasProducts,
  products = [],
}: RoomPackageDetailHeaderProps) {
  // Calculate minimum available inventory across all products
  const minInventory = products.length > 0
    ? Math.min(...products.map((p) => Number(p.inventory)))
    : 0;

  const [quantity, setQuantity] = useState(1);

  // Clamp quantity when inventory changes
  useEffect(() => {
    if (quantity > minInventory) {
      setQuantity(Math.max(1, minInventory));
    }
  }, [minInventory, quantity]);

  const handleIncrement = () => {
    if (quantity < minInventory) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  return (
    <Card>
      <CardHeader>
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={onBackToPackages}
            className="px-2"
            aria-label="Back to packages"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to packages
          </Button>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl lg:text-3xl">{roomPackage.name}</CardTitle>
            <CardDescription className="mt-3 text-base">
              {roomPackage.description}
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary">{getStyleLabel(roomPackage.style)}</Badge>
              <Badge variant="outline">{getRoomTypeLabel(roomPackage.roomType)}</Badge>
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 lg:items-end lg:text-right">
            <div>
              <div className="text-3xl font-bold lg:text-4xl">{formatINR(roomPackage.priceINR)}</div>
              <p className="mt-1 text-sm text-muted-foreground">package price</p>
            </div>
            
            {hasProducts && minInventory > 0 && (
              <QuantitySelector
                quantity={quantity}
                maxQuantity={minInventory}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            )}
            
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !hasProducts || minInventory === 0}
              size="lg"
              className="w-full lg:w-auto"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAddingToCart ? 'Adding to Cart...' : 'Add Entire Package to Cart'}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
