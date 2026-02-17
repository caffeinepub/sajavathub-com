import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { FurnitureSubCategory } from '../../backend';
import BackButton from '../../components/navigation/BackButton';

export default function FurnitureMenuPage() {
  const subCategories: Array<{ key: FurnitureSubCategory; label: string; description: string }> = [
    { key: FurnitureSubCategory.sofa, label: 'Sofas', description: 'Comfortable seating for your living room' },
    { key: FurnitureSubCategory.centerTable, label: 'Center Tables', description: 'Stylish coffee and center tables' },
    { key: FurnitureSubCategory.diningTable, label: 'Dining Tables', description: 'Elegant dining furniture' },
    { key: FurnitureSubCategory.cornerTable, label: 'Corner Tables', description: 'Space-saving corner solutions' },
    { key: FurnitureSubCategory.kingSizeBed, label: 'King Size Beds', description: 'Luxurious king-sized beds' },
    { key: FurnitureSubCategory.queenSizeBed, label: 'Queen Size Beds', description: 'Comfortable queen-sized beds' },
    { key: FurnitureSubCategory.bedSideTables, label: 'Bedside Tables', description: 'Convenient bedside storage' },
    { key: FurnitureSubCategory.dressingTable, label: 'Dressing Tables', description: 'Elegant vanity solutions' },
    { key: FurnitureSubCategory.studyTable, label: 'Study Tables', description: 'Functional workspace furniture' },
    { key: FurnitureSubCategory.sofaChairs, label: 'Sofa Chairs', description: 'Accent chairs and seating' },
    { key: FurnitureSubCategory.recliners, label: 'Recliners', description: 'Relaxing recliner chairs' },
    { key: FurnitureSubCategory.crockeryUnit, label: 'Crockery Units', description: 'Display and storage units' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/shop/categories" />

      <div className="mb-8">
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src="/assets/generated/furniture-living-room-hero.dim_1600x900.png"
            alt="Furniture Collection"
            className="h-64 w-full object-cover"
          />
        </div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Furniture</h1>
        <p className="text-lg text-muted-foreground">
          Explore our complete furniture collection organized by type
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {subCategories.map((subCat) => (
          <Link
            key={subCat.key}
            to="/shop/furniture/$subCategory"
            params={{ subCategory: subCat.key }}
          >
            <Card className="group cursor-pointer transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">
                  {subCat.label}
                </h3>
                <p className="text-sm text-muted-foreground">{subCat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
