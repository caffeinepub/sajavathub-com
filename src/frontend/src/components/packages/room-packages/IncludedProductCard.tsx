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
    <Card className="overflow-hidden">
      <div className="aspect-square overflow-hidden bg-muted">
        <SafeExternalImage
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{formatINR(product.priceINR)}</div>
          {isInStock ? (
            <Badge variant="secondary">In Stock</Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
