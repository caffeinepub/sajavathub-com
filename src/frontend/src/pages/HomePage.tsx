import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Sparkles, Users, Home, MessageSquare, ShoppingBag } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetDesigners, useGetPackages } from '../hooks/useQueries';
import { formatINR } from '../utils/format';

export default function HomePage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: designers } = useGetDesigners();
  const { data: packages } = useGetPackages();
  const isAuthenticated = !!identity;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' });
    } else {
      navigate({ to: '/quiz' });
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/havenly-india-hero.dim_1600x900.png"
            alt="Beautiful Indian interior design"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="relative container mx-auto px-4 py-32 md:py-40 lg:py-48">
          <div className="max-w-2xl space-y-8">
            <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Design Your Dream Home with India's Top Designers
            </h1>
            <p className="text-xl text-[#d4734d] md:text-2xl font-medium">
              From concept to completion, we match you with expert designers who bring your vision to life—beautifully and affordably.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6 bg-[#d4734d] hover:bg-[#c26643]">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                <Link to="/packages">View Packages</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6 md:text-5xl">
              Professional Design, Made Simple
            </h2>
            <p className="text-xl text-muted-foreground">
              We believe everyone deserves a beautiful home. Our platform connects you with talented designers who understand Indian aesthetics, lifestyles, and budgets.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold">Expert Designers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Work with India's most talented interior designers who understand local aesthetics, materials, and craftsmanship.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold">Personalized Approach</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every design is tailored to your unique style, space requirements, and budget—no cookie-cutter solutions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="pt-8 pb-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Home className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold">End-to-End Service</h3>
                <p className="text-muted-foreground leading-relaxed">
                  From concept to completion, we handle everything to bring your dream space to life with ease.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6 md:text-5xl">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Four simple steps to transform your space
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                1
              </div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Match</h3>
              <p className="text-muted-foreground">
                Take our style quiz and get paired with a designer who understands your vision
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                2
              </div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Share</h3>
              <p className="text-muted-foreground">
                Collaborate with your designer to discuss your style, budget, and needs
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                3
              </div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">See</h3>
              <p className="text-muted-foreground">
                Review custom design concepts with 3D renderings and product selections
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                4
              </div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Shop</h3>
              <p className="text-muted-foreground">
                Purchase items from your personalized list and bring your design to life
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/how-it-works">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Designer Showcase */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6 md:text-5xl">Meet Our Designers</h2>
            <p className="text-xl text-muted-foreground">
              Talented professionals ready to transform your space
            </p>
          </div>
          {designers && designers.length > 0 && (
            <div className="grid gap-8 md:grid-cols-3 mb-12">
              {designers.slice(0, 3).map((designer) => (
                <Link key={designer.id} to="/designers/$designerId" params={{ designerId: designer.id }}>
                  <Card className="group overflow-hidden transition-all hover:shadow-xl border-2">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={designer.portfolio[0]?.imageUrl || '/assets/generated/portfolio-1.dim_1200x800.png'}
                        alt={`${designer.name}'s portfolio`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="mb-2 text-xl font-semibold">{designer.name}</h3>
                      <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{designer.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {designer.styles.slice(0, 2).map((style: any, index: number) => (
                          <Badge key={index} variant="secondary">
                            {style.__kind__ || 'Style'}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <Link to="/designers">View All Designers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Package Highlights */}
      <section className="bg-muted/30 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-6 md:text-5xl">Choose Your Package</h2>
            <p className="text-xl text-muted-foreground">
              Flexible design services to fit every budget and project scope
            </p>
          </div>
          {packages && packages.length > 0 && (
            <div className="grid gap-8 md:grid-cols-3 mb-12 max-w-5xl mx-auto">
              {packages.slice(0, 3).map((pkg) => (
                <Card key={pkg.id} className="border-2 flex flex-col">
                  <CardContent className="pt-8 pb-8 flex-1 flex flex-col">
                    <h3 className="mb-2 text-2xl font-semibold">{pkg.name}</h3>
                    <p className="mb-4 text-3xl font-bold text-primary">{formatINR(Number(pkg.priceINR))}</p>
                    <p className="mb-6 text-muted-foreground flex-1">{pkg.description}</p>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="text-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/packages">View All Packages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
            <CardContent className="p-12 md:p-16 text-center relative">
              <div className="absolute inset-0 opacity-10">
                <img
                  src="/assets/generated/havenly-editorial-texture.dim_1200x800.png"
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <h2 className="font-serif text-4xl font-bold mb-6 md:text-5xl">
                  Ready to Transform Your Home?
                </h2>
                <p className="mb-10 text-xl text-muted-foreground max-w-2xl mx-auto">
                  {isAuthenticated
                    ? 'Visit your dashboard to manage your projects and connect with designers.'
                    : 'Start your design journey today with our simple style quiz.'}
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  {isAuthenticated ? (
                    <Button asChild size="lg" className="text-lg px-8 py-6">
                      <Link to="/dashboard">
                        Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
                        <Link to="/designers">Browse Designers</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
