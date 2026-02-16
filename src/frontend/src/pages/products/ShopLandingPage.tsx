import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GlobalProductSearchPanel from '../../components/products/GlobalProductSearchPanel';

export default function ShopLandingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">Shop</h1>
        <p className="text-lg text-muted-foreground">
          Browse our collection by room packages, category, or brand
        </p>
      </div>

      {/* Global Product Search */}
      <div className="mb-16">
        <GlobalProductSearchPanel />
      </div>

      <Separator className="my-12" />

      {/* Browse Options */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">Browse by</h2>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {/* Room Category Tile */}
        <Link to="/products/room-category">
          <Card className="group overflow-hidden transition-all hover:shadow-xl">
            <div className="relative aspect-video overflow-hidden">
              <img
                src="/assets/generated/hero-indian-livingroom.dim_1600x900.png"
                alt="Package Products by Room"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="mb-2 text-2xl font-bold">Package Products by Room</h2>
                <p className="text-sm text-white/90">
                  Complete room packages by style
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-sm text-muted-foreground">
                Add entire room packages to cart with one click
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Products by Category Tile */}
        <Link to="/products">
          <Card className="group overflow-hidden transition-all hover:shadow-xl">
            <div className="relative aspect-video overflow-hidden">
              <img
                src="/assets/generated/shop-tile-categories.dim_1600x900.png"
                alt="Shop by Category"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="mb-2 text-2xl font-bold">Products by Category</h2>
                <p className="text-sm text-white/90">
                  Browse furniture and decor organized by room type
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-sm text-muted-foreground">
                Explore living room, bedroom, dining, office, and more
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Products by Brand Tile */}
        <Link to="/products/brands">
          <Card className="group overflow-hidden transition-all hover:shadow-xl">
            <div className="relative aspect-video overflow-hidden">
              <img
                src="/assets/generated/shop-tile-brands.dim_1600x900.png"
                alt="Shop by Brand"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="mb-2 text-2xl font-bold">Products by Brand</h2>
                <p className="text-sm text-white/90">
                  Shop from India's leading furniture brands
                </p>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-center text-sm text-muted-foreground">
                Discover Godrej Interio, Durian, Nilkamal, and more
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
