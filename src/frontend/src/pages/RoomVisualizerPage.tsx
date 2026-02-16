import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, AlertCircle, Info } from 'lucide-react';
import { useGetProductCategories } from '../hooks/useQueries';
import type { Product } from '../backend';

export default function RoomVisualizerPage() {
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scale, setScale] = useState([100]);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { data: categories, isLoading } = useGetProductCategories();

  // Flatten all products from categories
  const allProducts: Product[] = categories?.flatMap((cat) => cat.products) || [];

  const handleRoomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRoomImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = allProducts.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedProduct && roomImage) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setRoomImage(null);
    setSelectedProduct(null);
    setScale([100]);
    setPosition({ x: 50, y: 50 });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground">AI Room Visualizer</h1>
        <p className="text-lg text-muted-foreground">
          Preview how furniture will look in your space
        </p>
      </div>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Preview Tool</AlertTitle>
        <AlertDescription>
          This is a manual preview tool. Upload a photo of your room, select a product, and adjust its size and position to visualize how it might look in your space.
        </AlertDescription>
      </Alert>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Controls Panel */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload Room Photo</CardTitle>
              <CardDescription>Choose a photo of your room</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="room-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-primary">
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload</span>
                  </div>
                  <Input
                    id="room-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleRoomImageUpload}
                  />
                </Label>
                {roomImage && (
                  <p className="text-sm text-muted-foreground">✓ Room photo uploaded</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Product</CardTitle>
              <CardDescription>Choose a product to overlay</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select onValueChange={handleProductSelect} value={selectedProduct?.id || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {allProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {selectedProduct && (
                <div className="mt-4">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="h-32 w-full rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/generated/portfolio-1.dim_1200x800.png';
                    }}
                  />
                  <p className="mt-2 text-sm font-medium">{selectedProduct.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedProduct && roomImage && (
            <Card>
              <CardHeader>
                <CardTitle>Adjust Product</CardTitle>
                <CardDescription>Scale and position the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-2 block text-sm">Scale: {scale[0]}%</Label>
                  <Slider
                    value={scale}
                    onValueChange={setScale}
                    min={20}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1">💡 Tips:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Drag the product to reposition</li>
                    <li>Use the slider to adjust size</li>
                  </ul>
                </div>
                <Button onClick={handleReset} variant="outline" className="w-full">
                  Reset
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Canvas */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                {!roomImage
                  ? 'Upload a room photo to get started'
                  : !selectedProduct
                    ? 'Select a product to overlay'
                    : 'Drag to reposition the product'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!roomImage ? (
                <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                  <div className="text-center text-muted-foreground">
                    <Upload className="mx-auto mb-2 h-12 w-12" />
                    <p>Upload a room photo to begin</p>
                  </div>
                </div>
              ) : (
                <div
                  ref={canvasRef}
                  className="relative aspect-video cursor-move overflow-hidden rounded-lg"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={roomImage}
                    alt="Room"
                    className="h-full w-full object-contain"
                  />
                  {selectedProduct && (
                    <div
                      className="absolute"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        width: `${scale[0]}px`,
                        height: `${scale[0]}px`,
                        pointerEvents: isDragging ? 'none' : 'auto',
                      }}
                    >
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="h-full w-full object-contain drop-shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/generated/portfolio-1.dim_1200x800.png';
                        }}
                        draggable={false}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
