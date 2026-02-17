import StylePackagesSection from '../../components/packages/StylePackagesSection';
import BackButton from '../../components/navigation/BackButton';

export default function RoomCategoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <BackButton fallbackPath="/shop" className="mb-6" />
        
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">Package Products by Room</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Browse complete room packages by style and room type. Add all items to your cart with a single click.
          </p>
        </div>
      </div>

      <StylePackagesSection />
    </div>
  );
}
