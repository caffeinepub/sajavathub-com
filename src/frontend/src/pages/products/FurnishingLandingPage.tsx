import BackButton from '../../components/navigation/BackButton';

export default function FurnishingLandingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/shop" className="mb-8" />

      <div className="mb-12">
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10">
          <div className="p-12 text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">Furnishing</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Complete your home with our selection of curtains, rugs, cushions, and soft furnishings
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="mb-3 text-2xl font-semibold text-foreground">Coming Soon</h2>
          <p className="text-muted-foreground">
            We're preparing a beautiful collection of furnishing items for you. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
