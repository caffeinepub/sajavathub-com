import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRequestOtp, useVerifyOtp, useRegisterVendor } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface VendorRegistrationCardProps {
  onSuccess?: () => void;
}

type RegistrationStep = 'details' | 'otp' | 'success';

export default function VendorRegistrationCard({ onSuccess }: VendorRegistrationCardProps) {
  const [step, setStep] = useState<RegistrationStep>('details');
  const [vendorName, setVendorName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const requestOtpMutation = useRequestOtp();
  const verifyOtpMutation = useVerifyOtp();
  const registerVendorMutation = useRegisterVendor();

  const validateVendorName = (name: string): string | null => {
    if (!name.trim()) {
      return 'Vendor name is required';
    }
    if (name.trim().length < 3) {
      return 'Vendor name must be at least 3 characters';
    }
    return null;
  };

  const validateMobileNumber = (mobile: string): string | null => {
    if (!mobile.trim()) {
      return 'Mobile number is required';
    }
    if (!/^\d{10}$/.test(mobile)) {
      return 'Please enter a valid 10-digit mobile number';
    }
    return null;
  };

  const validateGstNumber = (gst: string): string | null => {
    if (!gst.trim()) {
      return 'GST number is mandatory for vendor registration';
    }
    // GST format: 2 digits (state code) + 10 alphanumeric (PAN) + 1 digit (entity number) + 1 letter (Z by default) + 1 alphanumeric (checksum)
    const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstPattern.test(gst.toUpperCase())) {
      return 'Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)';
    }
    return null;
  };

  const validateOtp = (otpValue: string): string | null => {
    if (!otpValue.trim()) {
      return 'OTP is required';
    }
    if (otpValue.length !== 6) {
      return 'OTP must be 6 digits';
    }
    return null;
  };

  const handleRequestOtp = async () => {
    setError('');
    setFieldErrors({});

    // Validate all fields
    const errors: Record<string, string> = {};
    const nameError = validateVendorName(vendorName);
    const mobileError = validateMobileNumber(mobileNumber);
    const gstError = validateGstNumber(gstNumber);

    if (nameError) errors.vendorName = nameError;
    if (mobileError) errors.mobileNumber = mobileError;
    if (gstError) errors.gstNumber = gstError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please correct the errors above before proceeding');
      return;
    }

    try {
      await requestOtpMutation.mutateAsync({ mobileNumber });
      toast.success('OTP sent successfully to ' + mobileNumber);
      setStep('otp');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    setError('');
    setFieldErrors({});

    const otpError = validateOtp(otp);
    if (otpError) {
      setFieldErrors({ otp: otpError });
      setError(otpError);
      return;
    }

    try {
      // First verify OTP
      await verifyOtpMutation.mutateAsync({ mobileNumber, otp });

      // Then register vendor
      const vendorId = `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await registerVendorMutation.mutateAsync({
        id: vendorId,
        name: vendorName.trim(),
        gstNumber: gstNumber.toUpperCase().trim(),
        mobileNumber,
      });

      toast.success('Vendor registered successfully!');
      setStep('success');

      // Call onSuccess callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to verify OTP or register vendor. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleReset = () => {
    setStep('details');
    setVendorName('');
    setMobileNumber('');
    setGstNumber('');
    setOtp('');
    setError('');
    setFieldErrors({});
  };

  const handleBackToDetails = () => {
    setStep('details');
    setOtp('');
    setError('');
    setFieldErrors({});
  };

  if (step === 'success') {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="mb-4 h-16 w-16 text-green-600 dark:text-green-400" />
          <h3 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-100">
            Registration Successful!
          </h3>
          <p className="mb-4 text-center text-sm text-green-700 dark:text-green-300">
            {vendorName} has been registered and verified successfully.
          </p>
          <div className="rounded-lg bg-white/50 p-4 dark:bg-black/20">
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Mobile:</span> {mobileNumber}
              </p>
              <p>
                <span className="font-medium">GST:</span> {gstNumber}
              </p>
            </div>
          </div>
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
            ? 'Step 1 of 2: Enter vendor details to begin registration'
            : 'Step 2 of 2: Verify mobile number with OTP to complete registration'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                onChange={(e) => {
                  setVendorName(e.target.value);
                  if (fieldErrors.vendorName) {
                    const { vendorName: _, ...rest } = fieldErrors;
                    setFieldErrors(rest);
                  }
                }}
                disabled={requestOtpMutation.isPending}
                className={fieldErrors.vendorName ? 'border-destructive' : ''}
              />
              {fieldErrors.vendorName && (
                <p className="text-sm text-destructive">{fieldErrors.vendorName}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Full legal name or business name as registered
              </p>
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
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                  if (fieldErrors.mobileNumber) {
                    const { mobileNumber: _, ...rest } = fieldErrors;
                    setFieldErrors(rest);
                  }
                }}
                disabled={requestOtpMutation.isPending}
                maxLength={10}
                className={fieldErrors.mobileNumber ? 'border-destructive' : ''}
              />
              {fieldErrors.mobileNumber && (
                <p className="text-sm text-destructive">{fieldErrors.mobileNumber}</p>
              )}
              <p className="text-xs text-muted-foreground">
                OTP will be sent to this number for verification
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gstNumber">
                GST Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gstNumber"
                placeholder="Enter GST number (e.g., 22AAAAA0000A1Z5)"
                value={gstNumber}
                onChange={(e) => {
                  setGstNumber(e.target.value.toUpperCase());
                  if (fieldErrors.gstNumber) {
                    const { gstNumber: _, ...rest } = fieldErrors;
                    setFieldErrors(rest);
                  }
                }}
                disabled={requestOtpMutation.isPending}
                maxLength={15}
                className={fieldErrors.gstNumber ? 'border-destructive' : ''}
              />
              {fieldErrors.gstNumber && (
                <p className="text-sm text-destructive">{fieldErrors.gstNumber}</p>
              )}
              <p className="text-xs text-muted-foreground">
                GST number is mandatory for vendor registration (15 characters)
              </p>
            </div>

            <Button
              onClick={handleRequestOtp}
              disabled={requestOtpMutation.isPending}
              className="w-full"
              size="lg"
            >
              {requestOtpMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue to Verification
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="mb-3 text-sm font-semibold">Vendor Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor Name:</span>
                  <span className="font-medium">{vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mobile Number:</span>
                  <span className="font-medium">{mobileNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST Number:</span>
                  <span className="font-medium">{gstNumber}</span>
                </div>
              </div>
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
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (fieldErrors.otp) {
                    const { otp: _, ...rest } = fieldErrors;
                    setFieldErrors(rest);
                  }
                }}
                disabled={verifyOtpMutation.isPending || registerVendorMutation.isPending}
                maxLength={6}
                className={fieldErrors.otp ? 'border-destructive' : ''}
                autoFocus
              />
              {fieldErrors.otp && (
                <p className="text-sm text-destructive">{fieldErrors.otp}</p>
              )}
              <p className="text-xs text-muted-foreground">
                A 6-digit OTP has been sent to {mobileNumber}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBackToDetails}
                disabled={verifyOtpMutation.isPending || registerVendorMutation.isPending}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleVerifyOtpAndRegister}
                disabled={verifyOtpMutation.isPending || registerVendorMutation.isPending}
                className="flex-1"
                size="lg"
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

            <div className="text-center">
              <Button
                variant="link"
                onClick={handleRequestOtp}
                disabled={requestOtpMutation.isPending}
                className="text-xs"
              >
                Didn't receive OTP? Resend
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
