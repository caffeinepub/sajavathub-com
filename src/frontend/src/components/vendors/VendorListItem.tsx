import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store, Phone, FileText, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/format';
import type { Vendor } from '../../backend';

interface VendorListItemProps {
  vendor: Vendor;
}

export default function VendorListItem({ vendor }: VendorListItemProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{vendor.name}</CardTitle>
          </div>
          {vendor.verified && (
            <Badge variant="default" className="bg-green-600 hover:bg-green-700">
              Verified
            </Badge>
          )}
        </div>
        <CardDescription className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          GST: {vendor.gstNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Phone className="h-3.5 w-3.5" />
            Mobile:
          </span>
          <span className="font-medium">{vendor.mobileNumber}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Registered:
          </span>
          <span className="font-medium">{formatDate(vendor.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
