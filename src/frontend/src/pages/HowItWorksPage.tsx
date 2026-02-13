import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">How SajavatHub Works</h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              We've simplified the interior design process to make it accessible, affordable, and
              enjoyable for every Indian homeowner.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {[
              {
                step: 1,
                title: 'Share Your Vision',
                description:
                  'Start by taking our style quiz. Tell us about your room type, budget range, preferred styles, and timeline. This helps us understand your unique needs and preferences.',
                features: [
                  'Quick 5-minute quiz',
                  'No commitment required',
                  'Personalized recommendations',
                ],
              },
              {
                step: 2,
                title: 'Choose Your Package',
                description:
                  'Select from our flexible service packages designed for Indian homes. Whether you need a complete room makeover or just design guidance, we have options to fit your budget.',
                features: [
                  'Transparent pricing in INR',
                  'Flexible service levels',
                  'No hidden costs',
                ],
              },
              {
                step: 3,
                title: 'Meet Your Designer',
                description:
                  'We match you with an expert interior designer who specializes in your preferred style and understands Indian aesthetics, local materials, and cultural preferences.',
                features: [
                  'Curated designer matching',
                  'Portfolio review',
                  'Initial consultation',
                ],
              },
              {
                step: 4,
                title: 'Collaborate & Create',
                description:
                  'Work closely with your designer through our platform. Share ideas, review concepts, and track progress as your vision comes to life.',
                features: [
                  'Real-time project updates',
                  'Direct designer communication',
                  'Revision rounds included',
                ],
              },
              {
                step: 5,
                title: 'Transform Your Space',
                description:
                  'Receive detailed design plans, shopping lists, and implementation guidance. We support you through the entire transformation process.',
                features: [
                  'Detailed design deliverables',
                  'Vendor recommendations',
                  'Implementation support',
                ],
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className={`grid gap-8 lg:grid-cols-2 lg:gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h2 className="mb-4 text-3xl font-bold">{item.title}</h2>
                  <p className="mb-6 text-lg text-muted-foreground">{item.description}</p>
                  <ul className="space-y-3">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle className="mr-3 mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`flex items-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Card className="w-full">
                    <CardContent className="p-8">
                      <div className="aspect-video rounded-lg bg-muted"></div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 text-center md:p-12">
              <h2 className="mb-4 text-3xl font-bold">Ready to Get Started?</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Take our quick style quiz and discover how we can transform your space.
              </p>
              <Button asChild size="lg">
                <Link to="/onboarding/quiz">
                  Start Your Project <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
