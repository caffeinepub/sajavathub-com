import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import BackButton from '../../components/navigation/BackButton';

export default function ProductCategoriesPage() {
  const categories = [
    {
      id: 'furniture',
      name: 'Furniture',
      description: 'Sofas, beds, tables, and more for every room',
      image: '/assets/generated/furniture-living-room-hero.dim_1600x900.png',
      path: '/shop/furniture',
    },
    {
      id: 'furnishing',
      name: 'Furnishing',
      description: 'Curtains, cushions, and soft furnishings',
      image: '/assets/generated/category-rugs-textiles.dim_800x800.png',
      path: '/shop/furnishing',
    },
    {
      id: 'decor',
      name: 'Decor',
      description: 'Lighting, art, and decorative accessories',
      image: '/assets/generated/category-decor-lighting.dim_800x800.png',
      path: '/shop/decor',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/shop" />
      
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Shop by Category</h1>
        <p className="text-lg text-muted-foreground">
          Browse our three main categories: Furniture, Furnishing, and Decor
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {categories.map((category) => (
          <Link key={category.id} to={category.path}>
            <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
