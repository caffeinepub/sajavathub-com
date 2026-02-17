import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SafeExternalImage from './SafeExternalImage';
import AddToCartButton from '../cart/AddToCartButton';
import QuantitySelector from './QuantitySelector';
import { formatINR } from '../../utils/format';
import type { Product } from '../../backend';
import { useState, useEffect } from 'react';

interface ProductListingCardProps {
  product: Product;
}

export default function ProductListingCard({ product }: ProductListingCardProps) {
  const inventory = Number(product.inventory);
  const price = Number(product.priceINR);
  const [quantity, setQuantity] = useState(1);

  // Clamp quantity when inventory changes
  useEffect(() => {
    if (quantity > inventory) {
      setQuantity(Math.max(1, inventory));
    }
  }, [inventory, quantity]);

  const handleIncrement = () => {
    if (quantity < inventory) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
        
        {inventory > 0 && (
          <QuantitySelector
            quantity={quantity}
            maxQuantity={inventory}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        )}
        
        <AddToCartButton product={product} quantity={quantity} className="w-full" />
      </CardContent>
    </Card>
  );
}
