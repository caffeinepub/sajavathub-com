import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { formatINR } from '../../../utils/format';
import type { RoomPackage, StylePreference, RoomType } from '../../../backend';

interface RoomPackageDetailHeaderProps {
  roomPackage: RoomPackage;
  getStyleLabel: (style: StylePreference) => string;
  getRoomTypeLabel: (roomType: RoomType) => string;
  onAddToCart: () => void;
  isAddingToCart: boolean;
  hasProducts: boolean;
}

export default function RoomPackageDetailHeader({
  roomPackage,
  getStyleLabel,
  getRoomTypeLabel,
  onAddToCart,
  isAddingToCart,
  hasProducts,
}: RoomPackageDetailHeaderProps) {
  return (
    <Card>
      <CardHeader>
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
            <Button
              onClick={onAddToCart}
              disabled={isAddingToCart || !hasProducts}
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
