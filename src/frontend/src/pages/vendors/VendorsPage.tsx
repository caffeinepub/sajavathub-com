import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Store, Plus, AlertCircle } from 'lucide-react';
import { useGetAllVendors } from '../../hooks/useQueries';
import VendorRegistrationCard from '../../components/vendors/VendorRegistrationCard';
import VendorListItem from '../../components/vendors/VendorListItem';

export default function VendorsPage() {
  const [showRegistration, setShowRegistration] = useState(false);
  const { data: vendors, isLoading, error } = useGetAllVendors();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="mt-2 text-muted-foreground">
            Manage vendor registrations and view vendor information
          </p>
        </div>
        {!showRegistration && (
          <Button onClick={() => setShowRegistration(true)} className="gap-2" size="lg">
            <Plus className="h-4 w-4" />
            Register New Vendor
          </Button>
        )}
      </div>

      {showRegistration && (
        <div className="mb-8">
          <VendorRegistrationCard
            onSuccess={() => {
              setShowRegistration(false);
            }}
          />
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
              <div className="p-6">
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="mb-4 h-4 w-1/2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : vendors && vendors.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {vendors.length} {vendors.length === 1 ? 'vendor' : 'vendors'}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <VendorListItem key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Store className="mb-4 h-16 w-16 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">No Vendors Yet</h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Get started by registering your first vendor. All vendors require mobile verification
              and GST number.
            </p>
            {!showRegistration && (
              <Button onClick={() => setShowRegistration(true)} className="gap-2" size="lg">
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
