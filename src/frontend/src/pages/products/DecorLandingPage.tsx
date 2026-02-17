import BackButton from '../../components/navigation/BackButton';

export default function DecorLandingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/shop" className="mb-8" />

      <div className="mb-12">
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
          <div className="p-12 text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">Decor</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Transform your space with our curated collection of decorative items, lighting, and accessories
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">Coming Soon</h2>
          <p className="text-muted-foreground">
            We're curating an amazing collection of decor items for you. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
}
