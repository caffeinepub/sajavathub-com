import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallbackPath: string;
  label?: string;
  className?: string;
}

export default function BackButton({ fallbackPath, label = 'Back', className }: BackButtonProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if browser history is available and has entries
    if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
      try {
        window.history.back();
      } catch (error) {
        // Fallback if history.back() fails
        navigate({ to: fallbackPath });
      }
    } else {
      // Fallback when history is unavailable
      navigate({ to: fallbackPath });
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className={className}
      aria-label={label}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
}
