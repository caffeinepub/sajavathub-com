import { Link, useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../../state/cartStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus } from 'lucide-react';
import { formatINR } from '../../utils/format';
import SafeExternalImage from '../../components/products/SafeExternalImage';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, setQuantity, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const result = setQuantity(productId, newQuantity);
    if (!result.success) {
      toast.error(result.message);
    }
  };

  const handleCheckout = () => {
    navigate({ to: '/checkout' });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
          <p className="mb-8 text-muted-foreground">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link to="/shop">Start Shopping</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/shop/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link to="/shop" className="mb-8 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Continue Shopping
      </Link>

      <h1 className="mb-8 text-4xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.productId}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <SafeExternalImage
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatINR(item.priceINR)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            max={item.availableInventory}
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val >= 1) {
                                handleQuantityChange(item.productId, val);
                              }
                            }}
                            className="h-8 w-16 text-center"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.availableInventory}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.availableInventory} available
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <p className="font-bold">{formatINR(item.priceINR * item.quantity)}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatINR(subtotal)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (confirm('Are you sure you want to clear your cart?')) {
                    clearCart();
                    toast.success('Cart cleared');
                  }
                }}
              >
                Clear Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
