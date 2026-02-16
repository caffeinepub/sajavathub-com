import { Card, CardContent } from '@/components/ui/card';
import type { RoomPackage, StylePreference, RoomType } from '../../../backend';
import RoomPackageListItem from './RoomPackageListItem';

interface RoomPackageListProps {
  packages: RoomPackage[];
  selectedPackageId: string | null;
  onSelectPackage: (pkg: RoomPackage) => void;
  getStyleLabel: (style: StylePreference) => string;
  getRoomTypeLabel: (roomType: RoomType) => string;
}

export default function RoomPackageList({
  packages,
  selectedPackageId,
  onSelectPackage,
  getStyleLabel,
  getRoomTypeLabel,
}: RoomPackageListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg) => (
        <RoomPackageListItem
          key={pkg.id}
          roomPackage={pkg}
          isSelected={pkg.id === selectedPackageId}
          onSelect={() => onSelectPackage(pkg)}
          getStyleLabel={getStyleLabel}
          getRoomTypeLabel={getRoomTypeLabel}
        />
      ))}
    </div>
  );
}
