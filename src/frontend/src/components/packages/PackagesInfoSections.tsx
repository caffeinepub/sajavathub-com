import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Palette, Home, ShoppingBag, Users, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';

export default function PackagesInfoSections() {
  return (
    <div className="space-y-20">
      {/* How It Works */}
      <section className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">How Our Design Process Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            From matching with your designer to shopping your final look, we guide you through every step of creating a space you'll love
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">1. Match with a Designer</CardTitle>
              <CardDescription>
                Take our style quiz and get paired with a talented designer who understands your aesthetic and functional needs
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">2. Share Your Vision</CardTitle>
              <CardDescription>
                Collaborate with your designer through consultations to discuss your style, budget, and how you want your space to function
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">3. See Your Design</CardTitle>
              <CardDescription>
                Review custom design concepts with 3D renderings, product selections, and layout plans tailored specifically to your space
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">4. Shop Your Look</CardTitle>
              <CardDescription>
                Purchase items from your personalized shopping list and bring your beautifully designed space to life
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">What's Included in Every Package</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              All our design services come with comprehensive support to ensure your project is a success
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Expert Designer Partnership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Work one-on-one with a professional interior designer who brings years of experience and creative vision to your project
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Palette className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Custom Design Concepts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive personalized design ideas and mood boards that reflect your unique style, from traditional to contemporary
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">3D Room Renderings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize your space before making any purchases with realistic 3D renderings that show exactly how your room will look
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Curated Shopping List</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get a detailed shopping list with furniture, decor, and accessories handpicked by your designer to fit your budget
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Multiple Revisions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Refine your design with unlimited revisions until you absolutely love every detail of your new space
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Satisfaction Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We're committed to your happiness. If you're not satisfied with your design, we'll work with you to make it right
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Design Styles */}
      <section className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Explore Design Styles</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Our designers are experts in a wide range of styles. Find the aesthetic that speaks to you
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <Badge variant="secondary" className="w-fit">Modern</Badge>
              <CardTitle className="text-lg">Contemporary & Modern</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Clean lines, neutral palettes, and functional furniture create sophisticated spaces with a timeless appeal
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <Badge variant="secondary" className="w-fit">Traditional</Badge>
              <CardTitle className="text-lg">Classic & Traditional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Rich woods, elegant fabrics, and ornate details bring warmth and timeless elegance to your home
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <Badge variant="secondary" className="w-fit">Minimalist</Badge>
              <CardTitle className="text-lg">Minimalist & Zen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Less is more with uncluttered spaces, natural materials, and a focus on functionality and tranquility
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <Badge variant="secondary" className="w-fit">Boho</Badge>
              <CardTitle className="text-lg">Bohemian & Eclectic</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mix patterns, textures, and global influences for a free-spirited, artistic vibe full of personality
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <Badge variant="secondary" className="w-fit">Rustic</Badge>
              <CardTitle className="text-lg">Rustic & Farmhouse</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Natural textures, reclaimed wood, and cozy elements create warm, inviting spaces with countryside charm
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <Badge variant="secondary" className="w-fit">Fusion</Badge>
              <CardTitle className="text-lg">Indian Contemporary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Blend traditional Indian craftsmanship with modern design for spaces that honor heritage while embracing the present
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our design services
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How long does the design process take?
                </AccordionTrigger>
                <AccordionContent>
                  The timeline varies by package and project complexity. Typically, you'll receive your initial design concepts within 7-10 days after your consultation. The complete process, including revisions and final delivery, usually takes 2-4 weeks.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  Can I work with a specific designer?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! After taking our style quiz, you'll see designer recommendations based on your preferences. You can review their portfolios and select the designer whose style resonates most with your vision.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  What if I don't like the initial design?
                </AccordionTrigger>
                <AccordionContent>
                  All our packages include multiple revisions. Your designer will work closely with you to refine the design until you're completely satisfied. We're committed to creating a space you'll love.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  Do I have to purchase everything from your shopping list?
                </AccordionTrigger>
                <AccordionContent>
                  Not at all! The shopping list is a curated guide to help you achieve the designed look. You're free to purchase items at your own pace, substitute products, or use pieces you already own. Your designer can help you make adjustments as needed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  Can you work within my budget?
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely! During your consultation, you'll discuss your budget with your designer. They'll create a design and shopping list that fits within your financial parameters while maximizing style and quality.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">
                  Do you offer services outside major cities?
                </AccordionTrigger>
                <AccordionContent>
                  Yes! Our online design services are available throughout India. For in-person consultations (available with Pro and Premier packages), we currently serve Mumbai, Delhi, Bangalore, and Pune, with plans to expand to more cities soon.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
