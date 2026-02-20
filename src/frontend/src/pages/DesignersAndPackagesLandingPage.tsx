import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';

export default function DesignersAndPackagesLandingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Designers and Design Packages</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Connect with talented designers or explore our curated design packages
        </p>
      </div>

      {/* Browse Options */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Designers */}
        <Link to="/designers">
          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
              <img
                src="/assets/generated/designers-option.dim_800x600.png"
                alt="Designers"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold">Designers</h3>
              <p className="text-sm text-muted-foreground">
                Browse our talented designers and find the perfect match for your project
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Design Packages */}
        <Link to="/packages">
          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-secondary/20 to-secondary/5">
              <img
                src="/assets/generated/packages-option.dim_800x600.png"
                alt="Design Packages"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold">Design Packages</h3>
              <p className="text-sm text-muted-foreground">
                Explore our design service packages tailored to your budget and needs
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
