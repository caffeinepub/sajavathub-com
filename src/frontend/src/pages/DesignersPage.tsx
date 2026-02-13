import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetDesigners } from '../hooks/useQueries';
import type { StylePreference } from '../backend';

const stylePreferenceLabels: Record<string, string> = {
  modern: 'Modern',
  traditional: 'Traditional',
  contemporary: 'Contemporary',
  boho: 'Boho',
  minimalist: 'Minimalist',
  rustic: 'Rustic',
};

function getStyleLabel(style: StylePreference): string {
  if ('__kind__' in style) {
    return stylePreferenceLabels[style.__kind__] || style.__kind__;
  }
  return 'Other';
}

export default function DesignersPage() {
  const { data: designers, isLoading } = useGetDesigners();
  const [searchQuery, setSearchQuery] = useState('');
  const [styleFilter, setStyleFilter] = useState<string>('all');

  const filteredDesigners = useMemo(() => {
    if (!designers) return [];

    return designers.filter((designer) => {
      const matchesSearch = designer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStyle =
        styleFilter === 'all' ||
        designer.styles.some((style) => getStyleLabel(style).toLowerCase() === styleFilter.toLowerCase());

      return matchesSearch && matchesStyle;
    });
  }, [designers, searchQuery, styleFilter]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading designers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">Our Designers</h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Meet India's most talented interior designers. Each brings unique expertise and a
              passion for creating beautiful spaces.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Search Designers</Label>
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Filter by Style</Label>
              <Select value={styleFilter} onValueChange={setStyleFilter}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="All Styles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Styles</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="contemporary">Contemporary</SelectItem>
                  <SelectItem value="boho">Boho</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="rustic">Rustic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredDesigners.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredDesigners.map((designer) => (
                <Link key={designer.id} to="/designers/$designerId" params={{ designerId: designer.id }}>
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden rounded-t-lg bg-muted">
                        <img
                          src={
                            designer.portfolio[0]?.imageUrl ||
                            '/assets/generated/portfolio-1.dim_1200x800.png'
                          }
                          alt={designer.name}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="mb-2 text-xl font-semibold">{designer.name}</h3>
                        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                          {designer.bio}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {designer.styles.slice(0, 3).map((style, idx) => (
                            <Badge key={idx} variant="secondary">
                              {getStyleLabel(style)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No designers found matching your criteria. Try adjusting your filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
