import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SafeExternalImage from './SafeExternalImage';
import AddToCartButton from '../cart/AddToCartButton';
import { formatINR } from '../../utils/format';
import type { Product } from '../../backend';

interface ProductListingCardProps {
  product: Product;
}

export default function ProductListingCard({ product }: ProductListingCardProps) {
  const inventory = Number(product.inventory);
  const price = Number(product.priceINR);

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="aspect-square overflow-hidden">
        <SafeExternalImage
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="flex-1">
        <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">{formatINR(price)}</span>
          <Badge variant={inventory > 0 ? 'default' : 'secondary'}>
            {inventory > 0 ? `${inventory} in stock` : 'Out of stock'}
          </Badge>
        </div>
        <AddToCartButton product={product} className="w-full" />
      </CardContent>
    </Card>
  );
}
