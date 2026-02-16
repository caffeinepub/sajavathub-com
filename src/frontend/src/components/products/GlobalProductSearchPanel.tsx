import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useGlobalProductSearch } from '../../hooks/useQueries';
import ProductListingCard from './ProductListingCard';

export default function GlobalProductSearchPanel() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchTerm = useDebouncedValue(searchInput, 500);
  
  const { data: searchResults, isLoading, error } = useGlobalProductSearch(debouncedSearchTerm);

  const showResults = debouncedSearchTerm.trim().length > 0;
  const hasResults = searchResults && searchResults.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Products
          </CardTitle>
          <CardDescription>
            Search across all furniture and decor items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {showResults && (
        <div>
          {isLoading && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Searching...</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-square w-full" />
                    <CardHeader>
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to search products. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && hasResults && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((product) => (
                  <ProductListingCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && !error && !hasResults && (
            <Alert>
              <AlertDescription>
                No products found matching "{debouncedSearchTerm}". Try different keywords.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
