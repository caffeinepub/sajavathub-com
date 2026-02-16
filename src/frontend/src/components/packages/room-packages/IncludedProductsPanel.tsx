import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product } from '../../../backend';
import IncludedProductCard from './IncludedProductCard';
import { sortProducts, SortOption, sortOptions } from '../../../utils/roomPackageSort';

interface IncludedProductsPanelProps {
  products: Product[];
}

export default function IncludedProductsPanel({ products }: IncludedProductsPanelProps) {
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');

  const sortedProducts = sortProducts(products, sortBy);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold">
          Included Products ({products.length})
        </h3>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => (
          <IncludedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
