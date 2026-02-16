import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SafeExternalImage from '../../products/SafeExternalImage';
import { formatINR } from '../../../utils/format';
import type { Product } from '../../../backend';

interface IncludedProductCardProps {
  product: Product;
}

export default function IncludedProductCard({ product }: IncludedProductCardProps) {
  const inventory = Number(product.inventory);
  const isInStock = inventory > 0;

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {/* Stable image region */}
      <div className="aspect-square w-full flex-shrink-0 overflow-hidden bg-muted">
        <SafeExternalImage
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      
      {/* Flexible content region with consistent spacing */}
      <CardHeader className="flex-grow space-y-2 p-4">
        <CardTitle className="line-clamp-2 text-base font-semibold leading-tight">
          {product.name}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
          {product.description}
        </CardDescription>
      </CardHeader>
      
      {/* Stable footer region with consistent padding */}
      <CardContent className="flex-shrink-0 px-4 pb-4 pt-0">
        <div className="flex items-center justify-between gap-3">
          <div className="text-lg font-bold text-foreground">{formatINR(product.priceINR)}</div>
          {isInStock ? (
            <Badge variant="secondary" className="flex-shrink-0 text-xs">
              In Stock
            </Badge>
          ) : (
            <Badge variant="destructive" className="flex-shrink-0 text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
