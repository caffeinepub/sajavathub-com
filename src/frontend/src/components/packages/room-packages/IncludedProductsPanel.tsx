import { useState } from 'react';
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
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold">
          Included Products ({products.length})
        </h3>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-select" className="text-sm font-medium">
            Sort by:
          </label>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger id="sort-select" className="w-[180px]">
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product) => (
          <IncludedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
