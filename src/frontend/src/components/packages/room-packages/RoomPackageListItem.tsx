import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '../../../utils/format';
import type { RoomPackage, StylePreference, RoomType } from '../../../backend';

interface RoomPackageListItemProps {
  roomPackage: RoomPackage;
  isSelected: boolean;
  onSelect: () => void;
  getStyleLabel: (style: StylePreference) => string;
  getRoomTypeLabel: (roomType: RoomType) => string;
}

export default function RoomPackageListItem({
  roomPackage,
  isSelected,
  onSelect,
  getStyleLabel,
  getRoomTypeLabel,
}: RoomPackageListItemProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary shadow-md' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <CardTitle className="text-lg">{roomPackage.name}</CardTitle>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className="text-xs">
            {getStyleLabel(roomPackage.style)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {getRoomTypeLabel(roomPackage.roomType)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          {formatINR(roomPackage.priceINR)}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {roomPackage.description}
        </p>
      </CardContent>
    </Card>
  );
}
