import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import type { Designer } from '../../backend';
import SafeExternalImage from '../products/SafeExternalImage';

interface RecommendedDesignerCardProps {
  designer: Designer;
  onSelect: (designerId: string) => void;
  isSelecting: boolean;
  disabled: boolean;
}

export default function RecommendedDesignerCard({
  designer,
  onSelect,
  isSelecting,
  disabled,
}: RecommendedDesignerCardProps) {
  const formatStyleName = (style: any): string => {
    if (typeof style === 'object' && style !== null && '__kind__' in style) {
      return style.__kind__.charAt(0).toUpperCase() + style.__kind__.slice(1);
    }
    return String(style);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-2">
      <div className="aspect-[4/3] overflow-hidden">
        {designer.portfolio.length > 0 ? (
          <SafeExternalImage
            src={designer.portfolio[0].imageUrl}
            alt={`${designer.name}'s portfolio`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            fallbackSrc="/assets/generated/portfolio-1.dim_1200x800.png"
          />
        ) : (
          <img
            src="/assets/generated/portfolio-1.dim_1200x800.png"
            alt={`${designer.name}'s portfolio`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="mb-2 text-xl font-semibold">{designer.name}</h3>
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{designer.bio}</p>
          <div className="flex flex-wrap gap-2">
            {designer.styles.slice(0, 3).map((style, index) => (
              <Badge key={index} variant="secondary">
                {formatStyleName(style)}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Link to="/designers/$designerId" params={{ designerId: designer.id }}>
              <Eye className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </Button>
          <Button
            onClick={() => onSelect(designer.id)}
            disabled={disabled}
            size="sm"
            className="flex-1"
          >
            {isSelecting ? 'Selecting...' : 'Work Together'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
