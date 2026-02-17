import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Store, Plus, AlertCircle } from 'lucide-react';
import { useGetAllVendors } from '../../hooks/useQueries';
import { formatDate } from '../../utils/format';
import VendorRegistrationCard from '../../components/vendors/VendorRegistrationCard';

export default function VendorsPage() {
  const [showRegistration, setShowRegistration] = useState(false);
  const { data: vendors, isLoading, error } = useGetAllVendors();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="mt-2 text-muted-foreground">
            Manage vendor registrations and view vendor information
          </p>
        </div>
        {!showRegistration && (
          <Button onClick={() => setShowRegistration(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Register New Vendor
          </Button>
        )}
      </div>

      {showRegistration && (
        <div className="mb-8">
          <VendorRegistrationCard onSuccess={() => setShowRegistration(false)} />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load vendors'}
          </AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : vendors && vendors.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  </div>
                  {vendor.verified && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Verified
                    </span>
                  )}
                </div>
                <CardDescription>GST: {vendor.gstNumber}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile:</span>
                  <span className="font-medium">{vendor.mobileNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registered:</span>
                  <span className="font-medium">{formatDate(vendor.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No Vendors Yet</h3>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Get started by registering your first vendor
            </p>
            {!showRegistration && (
              <Button onClick={() => setShowRegistration(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Register New Vendor
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
