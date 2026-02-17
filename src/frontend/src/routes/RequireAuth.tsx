import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert, LogIn } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, login, loginStatus } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <ShieldAlert className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Sign In Required</CardTitle>
            <CardDescription>
              You need to be signed in to access this area. This includes placing orders, managing
              your dashboard, and accessing vendor management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription className="text-sm">
                We use secure Internet Identity authentication to protect your account and data.
              </AlertDescription>
            </Alert>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="w-full"
              size="lg"
            >
              {loginStatus === 'logging-in' ? (
                'Signing in...'
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
