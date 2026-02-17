import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../state/cartStore';
import { toast } from 'sonner';
import type { Product } from '../../backend';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  variant = 'default',
  size = 'default',
  className,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const inventory = Number(product.inventory);
  const isOutOfStock = inventory === 0;

  const handleAddToCart = () => {
    // Ensure quantity is at least 1 and clamped to available inventory
    const validQuantity = Math.max(1, Math.min(Math.floor(quantity || 1), inventory));
    
    const result = addItem(
      {
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        priceINR: Number(product.priceINR),
        availableInventory: inventory,
      },
      validQuantity
    );

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
