import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, MessageSquare, Palette, ShoppingBag, Sparkles } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            How SajavatHub Works
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            From concept to completion, we make interior design simple, accessible, and enjoyable.
            Here's how we transform your space in five easy steps.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h2 className="mb-4 text-3xl font-bold">Take the Style Quiz</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Start by telling us about your space, style preferences, budget, and timeline.
                  Our quick quiz helps us understand your unique needs and vision.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Share your room type and dimensions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Select your preferred design styles</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Set your budget range in INR</span>
                  </li>
                </ul>
              </div>
              <Card className="flex items-center justify-center bg-muted/30 p-12">
                <Sparkles className="h-32 w-32 text-primary" />
              </Card>
            </div>

            {/* Step 2 */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <Card className="order-2 flex items-center justify-center bg-muted/30 p-12 lg:order-1">
                <ShoppingBag className="h-32 w-32 text-primary" />
              </Card>
              <div className="order-1 flex flex-col justify-center lg:order-2">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h2 className="mb-4 text-3xl font-bold">Choose Your Package</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Select from our range of design packages tailored to different needs and budgets.
                  Each package includes specific deliverables and designer support.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Starter, Premium, or Luxury packages</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Clear pricing in INR with no hidden fees</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Flexible options for every budget</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h2 className="mb-4 text-3xl font-bold">Get Matched with a Designer</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  We connect you with an experienced interior designer who specializes in your
                  preferred style and understands Indian homes.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Vetted professionals with proven portfolios</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Matched based on your style and needs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Direct communication through our platform</span>
                  </li>
                </ul>
              </div>
              <Card className="flex items-center justify-center bg-muted/30 p-12">
                <MessageSquare className="h-32 w-32 text-primary" />
              </Card>
            </div>

            {/* Step 4 */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <Card className="order-2 flex items-center justify-center bg-muted/30 p-12 lg:order-1">
                <Palette className="h-32 w-32 text-primary" />
              </Card>
              <div className="order-1 flex flex-col justify-center lg:order-2">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  4
                </div>
                <h2 className="mb-4 text-3xl font-bold">Collaborate & Refine</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Work closely with your designer through our platform. Share feedback, request
                  revisions, and watch your vision come to life.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Receive mood boards and design concepts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Review 3D renders and floor plans</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Unlimited revisions within your package</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 5 */}
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  5
                </div>
                <h2 className="mb-4 text-3xl font-bold">Bring It to Life</h2>
                <p className="mb-6 text-lg text-muted-foreground">
                  Get your final design package with shopping lists, vendor recommendations, and
                  implementation guidance to transform your space.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Detailed shopping lists with Indian vendors</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Implementation timeline and guidance</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>Ongoing support during execution</span>
                  </li>
                </ul>
              </div>
              <Card className="flex items-center justify-center bg-muted/30 p-12">
                <CheckCircle className="h-32 w-32 text-primary" />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Take the first step towards your dream home. Our style quiz takes just 5 minutes.
          </p>
          <Button asChild size="lg">
            <Link to="/quiz">Start Your Design Journey</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
