import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FaqPage() {
  const faqs = [
    {
      question: 'How does SajavatHub work?',
      answer:
        'SajavatHub connects you with expert interior designers in India. Start by taking our style quiz, choose a package that fits your budget, and get matched with a designer who understands your vision. Your designer will work with you to create a personalized design plan for your space.',
    },
    {
      question: 'What are the pricing options?',
      answer:
        'We offer flexible packages starting from affordable consultation services to comprehensive full-room design packages. All pricing is transparent and displayed in INR. Visit our Packages page to see detailed pricing and what\'s included in each tier.',
    },
    {
      question: 'How long does the design process take?',
      answer:
        'The timeline varies based on your selected package and project complexity. Typically, initial concepts are delivered within 1-2 weeks, with the complete design process taking 3-6 weeks. You can specify your preferred timeline during the onboarding quiz.',
    },
    {
      question: 'Do you work with clients across India?',
      answer:
        'Yes! We work with clients across major Indian cities including Mumbai, Delhi, Bangalore, Pune, and more. Our designers are familiar with local vendors, materials, and cultural preferences specific to different regions.',
    },
    {
      question: 'What if I don\'t like the initial design?',
      answer:
        'All our packages include revision rounds. Your designer will work closely with you to refine the design until you\'re completely satisfied. We believe in collaborative design and your feedback is essential to the process.',
    },
    {
      question: 'Can I choose my own designer?',
      answer:
        'While we carefully match you with a designer based on your style preferences and project requirements, you can browse our designer portfolio and request to work with a specific designer if they\'re available.',
    },
    {
      question: 'What deliverables will I receive?',
      answer:
        'Depending on your package, you\'ll receive mood boards, 2D/3D floor plans, detailed design concepts, color palettes, furniture and decor recommendations with shopping links, and implementation guidance. Higher-tier packages include more comprehensive deliverables.',
    },
    {
      question: 'Do you help with implementation?',
      answer:
        'Yes! We provide detailed shopping lists with vendor recommendations, implementation timelines, and guidance throughout the execution phase. Some packages also include on-site consultation to ensure everything comes together perfectly.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Everything you need to know about SajavatHub and our interior design services.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Still Have Questions?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              We're here to help! Reach out to our team for personalized assistance.
            </p>
            <a
              href="mailto:hello@sajavathub.com"
              className="text-lg font-medium text-primary hover:underline"
            >
              hello@sajavathub.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
