import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  quantity,
  maxQuantity,
  onIncrement,
  onDecrement,
  disabled = false,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="outline"
        size="icon"
        onClick={onDecrement}
        disabled={disabled || quantity <= 1}
        className="h-8 w-8"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-[2rem] text-center font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        onClick={onIncrement}
        disabled={disabled || quantity >= maxQuantity}
        className="h-8 w-8"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
