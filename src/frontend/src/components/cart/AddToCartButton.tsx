import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../state/cartStore';
import { toast } from 'sonner';
import type { Product } from '../../backend';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function AddToCartButton({
  product,
  variant = 'default',
  size = 'default',
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const inventory = Number(product.inventory);
  const isOutOfStock = inventory === 0;

  const handleAddToCart = () => {
    const result = addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      priceINR: Number(product.priceINR),
      availableInventory: inventory,
    });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAddToCart}
      disabled={isOutOfStock}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  );
}
