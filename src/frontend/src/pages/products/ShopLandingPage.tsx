import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GlobalProductSearchPanel from '../../components/products/GlobalProductSearchPanel';

export default function ShopLandingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Shop SajavatHub</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Discover curated furniture, decor, and furnishings for every room in your home
        </p>
      </div>

      {/* Global Product Search */}
      <div className="mb-12">
        <GlobalProductSearchPanel />
      </div>

      <Separator className="my-12" />

      {/* Browse Options */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Room Packages */}
        <Link to="/shop/room-packages">
          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
              <img
                src="/assets/generated/category-living-room.dim_800x800.png"
                alt="Room Packages"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold">Room Packages</h3>
              <p className="text-sm text-muted-foreground">
                Complete room solutions curated by style and room type
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Categories */}
        <Link to="/shop/categories">
          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-secondary/20 to-secondary/5">
              <img
                src="/assets/generated/shop-tile-categories.dim_1600x900.png"
                alt="Shop by Category"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold">Shop by Category</h3>
              <p className="text-sm text-muted-foreground">
                Browse Furniture, Furnishing, and Decor collections
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Brands */}
        <Link to="/shop/brands">
          <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
            <div className="aspect-video overflow-hidden bg-gradient-to-br from-accent/20 to-accent/5">
              <img
                src="/assets/generated/shop-tile-brands.dim_1600x900.png"
                alt="Shop by Brand"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="mb-2 text-xl font-semibold">Shop by Brand</h3>
              <p className="text-sm text-muted-foreground">
                Explore products from your favorite brands
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
