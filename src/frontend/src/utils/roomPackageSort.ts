import type { Product } from '../backend';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'name-desc', label: 'Name (Z → A)' },
  { value: 'price-asc', label: 'Price (Low → High)' },
  { value: 'price-desc', label: 'Price (High → Low)' },
];

export function sortProducts(products: Product[], sortBy: SortOption): Product[] {
  const sorted = [...products];

  switch (sortBy) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'price-asc':
      return sorted.sort((a, b) => Number(a.priceINR) - Number(b.priceINR));
    case 'price-desc':
      return sorted.sort((a, b) => Number(b.priceINR) - Number(a.priceINR));
    default:
      return sorted;
  }
}
