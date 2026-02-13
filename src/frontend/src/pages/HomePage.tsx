import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Sparkles, Users, Home } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate({ to: '/app/dashboard' });
    } else {
      navigate({ to: '/onboarding/quiz' });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Transform Your Indian Home with{' '}
                  <span className="text-primary">Expert Design</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Connect with India's top interior designers. Get personalized design solutions
                  tailored to your style, space, and budget.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button size="lg" onClick={handleGetStarted} className="text-base">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base">
                  <Link to="/packages">View Packages</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/hero-indian-livingroom.dim_1600x900.png"
                alt="Beautiful Indian living room interior"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose SajavatHub?</h2>
            <p className="text-lg text-muted-foreground">
              Professional interior design made accessible for every Indian home
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Expert Designers</h3>
                <p className="text-muted-foreground">
                  Work with India's most talented interior designers who understand local aesthetics
                  and preferences.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Personalized Approach</h3>
                <p className="text-muted-foreground">
                  Every design is tailored to your unique style, space requirements, and budget
                  constraints.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">End-to-End Service</h3>
                <p className="text-muted-foreground">
                  From concept to completion, we handle everything to bring your dream space to
                  life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Four simple steps to your dream interior
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: '1',
                title: 'Take the Quiz',
                description: 'Tell us about your space, style preferences, and budget.',
              },
              {
                step: '2',
                title: 'Choose a Package',
                description: 'Select the service level that fits your needs.',
              },
              {
                step: '3',
                title: 'Get Matched',
                description: 'We connect you with the perfect designer for your project.',
              },
              {
                step: '4',
                title: 'Transform Your Space',
                description: 'Collaborate with your designer to create your dream home.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/how-it-works">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Ready to Transform Your Home?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                {isAuthenticated
                  ? 'Visit your dashboard to manage your projects and connect with designers.'
                  : 'Sign in to start your interior design journey with personalized project tracking.'}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                {isAuthenticated ? (
                  <Button asChild size="lg">
                    <Link to="/app/dashboard">
                      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={login} disabled={isLoggingIn}>
                      {isLoggingIn ? 'Signing In...' : 'Sign In'}
                    </Button>
                    <Button asChild size="lg" variant="outline">
                      <Link to="/onboarding/quiz">Start Quiz</Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
