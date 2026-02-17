import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCartStore } from '../../state/cartStore';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { usePlaceOrder } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, CreditCard, Smartphone, Building2, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/format';
import SafeExternalImage from '../../components/products/SafeExternalImage';
import { PaymentMethod } from '../../backend';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { items, getSubtotal, clearCart } = useCartStore();
  const placeOrderMutation = usePlaceOrder();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.upi);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Buyer info state - editable fields
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Delivery address state
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    phoneNumber: '',
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const subtotal = getSubtotal();

  // Prefill buyer info and delivery address when user profile loads
  useEffect(() => {
    if (userProfile) {
      setBuyerInfo({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
      });
      setDeliveryAddress((prev) => ({
        ...prev,
        fullName: userProfile.name || '',
        phoneNumber: userProfile.phone || '',
        addressLine1: userProfile.address || '',
      }));
    }
  }, [userProfile]);

  const validateCheckout = (): boolean => {
    const errors: string[] = [];

    // Validate buyer info
    if (!buyerInfo.name.trim()) {
      errors.push('Name is required');
    }
    if (!buyerInfo.phone.trim()) {
      errors.push('Phone number is required');
    } else if (!/^\d{10}$/.test(buyerInfo.phone.replace(/\s/g, ''))) {
      errors.push('Phone number must be 10 digits');
    }

    // Validate delivery address
    if (!deliveryAddress.fullName.trim()) {
      errors.push('Delivery full name is required');
    }
    if (!deliveryAddress.addressLine1.trim()) {
      errors.push('Delivery address is required');
    }
    if (!deliveryAddress.city.trim()) {
      errors.push('City is required');
    }
    if (!deliveryAddress.state.trim()) {
      errors.push('State is required');
    }
    if (!deliveryAddress.country.trim()) {
      errors.push('Country is required');
    }
    if (!deliveryAddress.postalCode.trim()) {
      errors.push('PIN code is required');
    } else if (!/^\d{6}$/.test(deliveryAddress.postalCode.trim())) {
      errors.push('PIN code must be 6 digits');
    }
    if (!deliveryAddress.phoneNumber.trim()) {
      errors.push('Delivery phone number is required');
    } else if (!/^\d{10}$/.test(deliveryAddress.phoneNumber.replace(/\s/g, ''))) {
      errors.push('Delivery phone number must be 10 digits');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!identity) {
      toast.error('Please sign in to place an order');
      return;
    }

    if (!validateCheckout()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      const newOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await placeOrderMutation.mutateAsync({
        order: {
          id: newOrderId,
          buyerId: identity.getPrincipal(),
          items: items.map((item) => ({
            productId: item.productId,
            quantity: BigInt(item.quantity),
            price: BigInt(item.priceINR),
          })),
          totalAmount: BigInt(subtotal),
          paymentMethod,
          status: 'pending',
          createdAt: BigInt(Date.now() * 1000000),
          deliveryAddress: {
            fullName: deliveryAddress.fullName.trim(),
            addressLine1: deliveryAddress.addressLine1.trim(),
            addressLine2: deliveryAddress.addressLine2.trim() || undefined,
            city: deliveryAddress.city.trim(),
            state: deliveryAddress.state.trim(),
            country: deliveryAddress.country.trim(),
            postalCode: deliveryAddress.postalCode.trim(),
            phoneNumber: deliveryAddress.phoneNumber.trim(),
          },
        },
        buyerInfo: {
          name: buyerInfo.name.trim(),
          email: buyerInfo.email.trim(),
          phone: buyerInfo.phone.trim(),
          address: buyerInfo.address.trim(),
        },
        orderTotal: BigInt(subtotal),
      });

      setOrderId(newOrderId);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    }
  };

  if (items.length === 0 && !orderPlaced) {
    navigate({ to: '/cart' });
    return null;
  }

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">Order Placed Successfully!</h1>
          <p className="mb-2 text-muted-foreground">
            Thank you for your order. Your order has been received and is being processed.
          </p>
          <p className="mb-8 text-sm text-muted-foreground">Order ID: {orderId}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <a href="/shop">Continue Shopping</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/dashboard">View Dashboard</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Buyer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {validationErrors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={buyerInfo.name}
                    onChange={(e) => setBuyerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={buyerInfo.email}
                    onChange={(e) => setBuyerInfo((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  value={buyerInfo.phone}
                  onChange={(e) => setBuyerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  value={buyerInfo.address}
                  onChange={(e) => setBuyerInfo((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter your address"
                />
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Delivery Address</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryFullName">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="deliveryFullName"
                      value={deliveryAddress.fullName}
                      onChange={(e) =>
                        setDeliveryAddress((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryPhone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="deliveryPhone"
                      value={deliveryAddress.phoneNumber}
                      onChange={(e) =>
                        setDeliveryAddress((prev) => ({ ...prev, phoneNumber: e.target.value }))
                      }
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">
                    Address Line 1 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="addressLine1"
                    value={deliveryAddress.addressLine1}
                    onChange={(e) =>
                      setDeliveryAddress((prev) => ({ ...prev, addressLine1: e.target.value }))
                    }
                    placeholder="House/Flat No., Building Name, Street"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="addressLine2"
                    value={deliveryAddress.addressLine2}
                    onChange={(e) =>
                      setDeliveryAddress((prev) => ({ ...prev, addressLine2: e.target.value }))
                    }
                    placeholder="Landmark, Area"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        setDeliveryAddress((prev) => ({ ...prev, city: e.target.value }))
                      }
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">
                      State <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="state"
                      value={deliveryAddress.state}
                      onChange={(e) =>
                        setDeliveryAddress((prev) => ({ ...prev, state: e.target.value }))
                      }
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">
                      PIN Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      value={deliveryAddress.postalCode}
                      onChange={(e) =>
                        setDeliveryAddress((prev) => ({ ...prev, postalCode: e.target.value }))
                      }
                      placeholder="6-digit PIN code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="country"
                      value={deliveryAddress.country}
                      onChange={(e) =>
                        setDeliveryAddress((prev) => ({ ...prev, country: e.target.value }))
                      }
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              >
                <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted">
                  <RadioGroupItem value={PaymentMethod.upi} id="upi" />
                  <Label htmlFor="upi" className="flex flex-1 cursor-pointer items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">UPI</div>
                      <div className="text-sm text-muted-foreground">Pay using UPI apps</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted">
                  <RadioGroupItem value={PaymentMethod.netBanking} id="netbanking" />
                  <Label htmlFor="netbanking" className="flex flex-1 cursor-pointer items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Net Banking</div>
                      <div className="text-sm text-muted-foreground">Pay via your bank</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted">
                  <RadioGroupItem value={PaymentMethod.wallet} id="wallet" />
                  <Label htmlFor="wallet" className="flex flex-1 cursor-pointer items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Wallet</div>
                      <div className="text-sm text-muted-foreground">Pay using digital wallet</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                      <SafeExternalImage
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatINR(item.priceINR * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatINR(subtotal)}</span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={placeOrderMutation.isPending}
                className="w-full"
                size="lg"
              >
                {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
