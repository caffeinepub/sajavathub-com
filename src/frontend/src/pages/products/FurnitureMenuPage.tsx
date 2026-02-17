import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FurnitureSubCategory } from '../../backend';
import BackButton from '../../components/navigation/BackButton';

export default function FurnitureMenuPage() {
  const furnitureSubCategories = [
    { key: FurnitureSubCategory.sofa, label: 'Sofa' },
    { key: FurnitureSubCategory.centerTable, label: 'Center Table' },
    { key: FurnitureSubCategory.diningTable, label: 'Dining Table' },
    { key: FurnitureSubCategory.cornerTable, label: 'Corner Table' },
    { key: FurnitureSubCategory.kingSizeBed, label: 'King Size Bed' },
    { key: FurnitureSubCategory.queenSizeBed, label: 'Queen Size Bed' },
    { key: FurnitureSubCategory.bedSideTables, label: 'Bed Side Tables' },
    { key: FurnitureSubCategory.dressingTable, label: 'Dressing Table' },
    { key: FurnitureSubCategory.studyTable, label: 'Study Table' },
    { key: FurnitureSubCategory.sofaChairs, label: 'Sofa Chairs' },
    { key: FurnitureSubCategory.recliners, label: 'Recliners' },
    { key: FurnitureSubCategory.crockeryUnit, label: 'Crockery Unit' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <BackButton fallbackPath="/products" className="mb-8" />

      <div className="mb-12">
        <div className="relative mb-8 overflow-hidden rounded-2xl">
          <img
            src="/assets/generated/furniture-living-room-hero.dim_1600x900.png"
            alt="Furniture Collection"
            className="h-[400px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="mb-2 text-4xl font-bold tracking-tight">Furniture</h1>
            <p className="text-lg text-white/90">
              Explore our complete furniture collection for every room
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Browse by Category</h2>
          <p className="text-muted-foreground">
            Select a furniture category to view available products
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {furnitureSubCategories.map((subCat) => (
            <Link
              key={subCat.key}
              to="/products/furniture/$subCategory"
              params={{ subCategory: subCat.key }}
            >
              <Card className="group overflow-hidden transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start px-0 text-left transition-all"
                  >
                    <span className="text-lg font-semibold group-hover:text-primary">
                      {subCat.label}
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
