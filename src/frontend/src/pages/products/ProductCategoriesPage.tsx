import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackButton from '../../components/navigation/BackButton';

export default function ProductCategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/shop" className="mb-8" />

      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">Shop by Category</h1>
        <p className="text-lg text-muted-foreground">
          Explore our three main categories: Furniture, Furnishing, and Decor
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {/* Furniture Category */}
        <Link to="/products/furniture">
          <Card className="group overflow-hidden transition-all hover:shadow-xl">
            <div className="relative aspect-video overflow-hidden">
              <img
                src="/assets/generated/furniture-living-room-hero.dim_1600x900.png"
                alt="Furniture"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="mb-2 text-2xl font-bold">Furniture</h2>
                <p className="text-sm text-white/90">
                  Sofas, tables, beds, and more
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <Button variant="outline" className="w-full" size="lg">
                Browse Furniture
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Furnishing Category */}
        <Link to="/products/furnishing">
          <Card className="group overflow-hidden transition-all hover:shadow-xl">
            <div className="relative aspect-video overflow-hidden">
              <img
                src="/assets/generated/category-rugs-textiles.dim_800x800.png"
                alt="Furnishing"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="mb-2 text-2xl font-bold">Furnishing</h2>
                <p className="text-sm text-white/90">
                  Curtains, rugs, cushions, and textiles
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <Button variant="outline" className="w-full" size="lg">
                Browse Furnishing
              </Button>
            </CardContent>
          </Card>
        </Link>

        {/* Decor Category */}
        <Link to="/products/decor">
          <Card className="group overflow-hidden transition-all hover:shadow-xl">
            <div className="relative aspect-video overflow-hidden">
              <img
                src="/assets/generated/category-decor-lighting.dim_800x800.png"
                alt="Decor"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="mb-2 text-2xl font-bold">Decor</h2>
                <p className="text-sm text-white/90">
                  Wall art, vases, lighting, and accessories
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <Button variant="outline" className="w-full" size="lg">
                Browse Decor
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
