import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Gift, CalendarIcon, Heart, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '../../state/cartStore';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatINR } from '../../utils/format';

const PRESET_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

export default function GiftCardPage() {
  const navigate = useNavigate();
  const { setGiftCard } = useCartStore();

  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryTiming, setDeliveryTiming] = useState<'now' | 'scheduled'>('now');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
    }
  };

  const getFinalAmount = (): number => {
    if (customAmount) {
      const parsed = parseInt(customAmount);
      return !isNaN(parsed) && parsed > 0 ? parsed : selectedAmount;
    }
    return selectedAmount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!recipientEmail.trim()) {
      toast.error('Recipient email is required');
      return;
    }
    if (!senderName.trim()) {
      toast.error('Your name is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const finalAmount = getFinalAmount();
    if (finalAmount < 1000) {
      toast.error('Minimum gift card amount is ₹1,000');
      return;
    }

    if (deliveryTiming === 'scheduled' && !scheduledDate) {
      toast.error('Please select a delivery date');
      return;
    }

    // Store gift card in cart
    setGiftCard({
      amount: finalAmount,
      recipientEmail: recipientEmail.trim(),
      recipientName: recipientName.trim(),
      senderName: senderName.trim(),
      message: message.trim(),
      deliveryTime: deliveryTiming === 'scheduled' && scheduledDate ? scheduledDate.getTime() : null,
    });

    toast.success('Gift card added to cart');
    navigate({ to: '/checkout' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-flex items-center gap-2 text-primary">
                <Gift className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-wider">Gift Cards</span>
              </div>
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Give the Gift of Beautiful Spaces
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl">
                Let someone special transform their home with personalized interior design. Our gift cards never expire and can be used for any of our design services.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Never Expires</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">Instant Delivery</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/giftcard-hero.dim_1600x700.png"
                alt="Gift Card"
                className="h-full w-full rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gift Card Usage Info Section */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl border-primary/20 bg-background/80 backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl">Use Gift Cards for Any Design Package</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our gift cards can be applied toward any of our three design packages—from a quick room refresh to a complete home transformation. Recipients can choose the package that best fits their needs and style.
              </p>
              <Button asChild variant="outline" className="group">
                <Link to="/packages" className="inline-flex items-center gap-2">
                  View All Three Design Packages
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gift Card Form Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Form Column */}
              <div className="space-y-6 lg:col-span-2">
                {/* Amount Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Amount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {PRESET_AMOUNTS.map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant={selectedAmount === amount && !customAmount ? 'default' : 'outline'}
                          className="h-16 text-lg font-semibold"
                          onClick={() => handleAmountSelect(amount)}
                        >
                          {formatINR(amount)}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customAmount">Or Enter Custom Amount</Label>
                      <Input
                        id="customAmount"
                        type="number"
                        min="1000"
                        step="100"
                        placeholder="Minimum ₹1,000"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Recipient Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recipient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">
                        Recipient Name (Optional)
                      </Label>
                      <Input
                        id="recipientName"
                        placeholder="Who is this gift for?"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmail">
                        Recipient Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        placeholder="recipient@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Sender Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">
                        Your Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="senderName"
                        placeholder="Your name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Add a personal message to your gift..."
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">
                        {message.length}/500 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Timing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Timing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={deliveryTiming} onValueChange={(value) => setDeliveryTiming(value as 'now' | 'scheduled')}>
                      <div className="flex items-center space-x-3 rounded-lg border p-4">
                        <RadioGroupItem value="now" id="now" />
                        <Label htmlFor="now" className="flex-1 cursor-pointer">
                          <div className="font-medium">Send Now</div>
                          <div className="text-sm text-muted-foreground">
                            Gift card will be sent immediately after purchase
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-4">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <Label htmlFor="scheduled" className="flex-1 cursor-pointer">
                          <div className="font-medium">Schedule for Later</div>
                          <div className="text-sm text-muted-foreground">
                            Choose a specific date to send the gift card
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {deliveryTiming === 'scheduled' && (
                      <div className="space-y-2 pt-2">
                        <Label>Select Delivery Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={scheduledDate}
                              onSelect={setScheduledDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Summary Column */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Gift Card Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="overflow-hidden rounded-lg border bg-gradient-to-br from-primary/10 to-accent/10 p-6">
                      <img
                        src="/assets/generated/giftcard-mock.dim_1200x800.png"
                        alt="Gift Card Preview"
                        className="mb-4 w-full rounded-lg"
                      />
                      <div className="space-y-2 text-center">
                        <p className="text-sm font-medium text-muted-foreground">Gift Card Value</p>
                        <p className="text-3xl font-bold">{formatINR(getFinalAmount())}</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">To:</span>
                        <span className="font-medium">{recipientEmail || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">From:</span>
                        <span className="font-medium">{senderName || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery:</span>
                        <span className="font-medium">
                          {deliveryTiming === 'now'
                            ? 'Immediately'
                            : scheduledDate
                              ? format(scheduledDate, 'MMM d, yyyy')
                              : 'Not scheduled'}
                        </span>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Gift className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
