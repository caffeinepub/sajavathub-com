import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useRequestOtp, useVerifyOtp, useRegisterVendor } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface VendorRegistrationCardProps {
  onSuccess?: () => void;
}

export default function VendorRegistrationCard({ onSuccess }: VendorRegistrationCardProps) {
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');
  const [vendorName, setVendorName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();
  const registerVendorMutation = useRegisterVendor();

  const handleRequestOtp = async () => {
    setError('');

    if (!vendorName.trim()) {
      setError('Vendor name is required');
      return;
    }

    if (!mobileNumber.trim() || !/^\d{10}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    if (!gstNumber.trim()) {
      setError('GST number is required for vendor registration');
      return;
    }

    try {
      await requestOtpMutation.mutateAsync({ mobileNumber });
      toast.success('OTP sent successfully');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    setError('');

    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      // First verify OTP
      await verifyOtpMutation.mutateAsync({ mobileNumber, otp });

      // Then register vendor
      const vendorId = `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await registerVendorMutation.mutateAsync({
        id: vendorId,
        name: vendorName,
        gstNumber,
        mobileNumber,
      });

      toast.success('Vendor registered successfully!');
      setStep('success');

      // Call onSuccess callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP or register vendor. Please try again.');
    }
  };

  const handleReset = () => {
    setStep('details');
    setVendorName('');
    setMobileNumber('');
    setGstNumber('');
    setOtp('');
    setError('');
  };

  if (step === 'success') {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="mb-4 h-16 w-16 text-green-600 dark:text-green-400" />
          <h3 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-100">
            Registration Successful!
          </h3>
          <p className="text-center text-sm text-green-700 dark:text-green-300">
            The vendor has been registered and verified successfully.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Registration</CardTitle>
        <CardDescription>
          {step === 'details'
            ? 'Enter vendor details and request OTP for mobile verification'
            : 'Enter the OTP sent to the mobile number to complete registration'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'details' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="vendorName">
                Vendor Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vendorName"
                placeholder="Enter vendor or business name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                disabled={requestOtpMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                disabled={requestOtpMutation.isPending}
                maxLength={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber">
                GST Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gstNumber"
                placeholder="Enter GST number"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                disabled={requestOtpMutation.isPending}
              />
              <p className="text-xs text-muted-foreground">
                GST number is mandatory for vendor registration
              </p>
            </div>

            <Button
              onClick={handleRequestOtp}
              disabled={requestOtpMutation.isPending}
              className="w-full"
            >
              {requestOtpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Request OTP'
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm">
                <span className="font-medium">Vendor:</span> {vendorName}
              </p>
              <p className="text-sm">
                <span className="font-medium">Mobile:</span> {mobileNumber}
              </p>
              <p className="text-sm">
                <span className="font-medium">GST:</span> {gstNumber}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">
                Enter OTP <span className="text-destructive">*</span>
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={verifyOtpMutation.isPending || registerVendorMutation.isPending}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                An OTP has been sent to the mobile number for verification
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={verifyOtpMutation.isPending || registerVendorMutation.isPending}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleVerifyOtpAndRegister}
                disabled={verifyOtpMutation.isPending || registerVendorMutation.isPending}
                className="flex-1"
              >
                {verifyOtpMutation.isPending || registerVendorMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Register'
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
