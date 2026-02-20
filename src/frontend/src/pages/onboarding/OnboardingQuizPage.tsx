import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useOnboardingStore } from '../../state/onboardingStore';
import type { RoomType, StylePreference } from '../../backend';

export default function OnboardingQuizPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { designerId?: string };
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const {
    roomType,
    setRoomType,
    stylePreferences,
    setStylePreferences,
    budget,
    setBudget,
    timeline,
    setTimeline,
    setPreselectedDesignerId,
  } = useOnboardingStore();

  // Capture designer context from URL if present
  useEffect(() => {
    if (search.designerId) {
      setPreselectedDesignerId(search.designerId);
    }
  }, [search.designerId, setPreselectedDesignerId]);

  const roomTypes: { value: RoomType; label: string }[] = [
    { value: { __kind__: 'livingRoom', livingRoom: null }, label: 'Living Room' },
    { value: { __kind__: 'bedroom', bedroom: null }, label: 'Bedroom' },
    { value: { __kind__: 'diningRoom', diningRoom: null }, label: 'Dining Room' },
    { value: { __kind__: 'office', office: null }, label: 'Office' },
    { value: { __kind__: 'kidsRoom', kidsRoom: null }, label: 'Kids Room' },
  ];

  const styleOptions: { value: StylePreference; label: string }[] = [
    { value: { __kind__: 'modern', modern: null }, label: 'Modern' },
    { value: { __kind__: 'traditional', traditional: null }, label: 'Traditional' },
    { value: { __kind__: 'contemporary', contemporary: null }, label: 'Contemporary' },
    { value: { __kind__: 'boho', boho: null }, label: 'Boho' },
    { value: { __kind__: 'minimalist', minimalist: null }, label: 'Minimalist' },
    { value: { __kind__: 'rustic', rustic: null }, label: 'Rustic' },
  ];

  const toggleStyle = (style: StylePreference) => {
    const styleStr = JSON.stringify(style);
    const isSelected = stylePreferences.some((s) => JSON.stringify(s) === styleStr);
    
    if (isSelected) {
      setStylePreferences(stylePreferences.filter((s) => JSON.stringify(s) !== styleStr));
    } else {
      setStylePreferences([...stylePreferences, style]);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      navigate({ to: '/review' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return roomType !== null;
      case 2:
        return stylePreferences.length > 0;
      case 3:
        return budget !== null && Number(budget.min) > 0 && Number(budget.max) > Number(budget.min);
      case 4:
        return timeline.trim().length > 0;
      default:
        return false;
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif mb-4 text-3xl font-bold tracking-tight text-foreground">
          Design Style Quiz
        </h1>
        <Progress value={progress} className="h-2" />
        <p className="mt-2 text-sm text-muted-foreground">
          Step {step} of {totalSteps}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && 'What room are you designing?'}
            {step === 2 && 'What styles do you like?'}
            {step === 3 && 'What is your budget?'}
            {step === 4 && 'What is your timeline?'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Select the room type you want to design'}
            {step === 2 && 'Choose one or more styles that appeal to you'}
            {step === 3 && 'Enter your budget range in INR'}
            {step === 4 && 'When would you like to complete this project?'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <RadioGroup
              value={roomType ? JSON.stringify(roomType) : ''}
              onValueChange={(value) => setRoomType(JSON.parse(value))}
            >
              {roomTypes.map((room) => (
                <div key={room.label} className="flex items-center space-x-2">
                  <RadioGroupItem value={JSON.stringify(room.value)} id={room.label} />
                  <Label htmlFor={room.label} className="cursor-pointer">
                    {room.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {styleOptions.map((style) => {
                const isChecked = stylePreferences.some(
                  (s) => JSON.stringify(s) === JSON.stringify(style.value)
                );
                return (
                  <div key={style.label} className="flex items-center space-x-2">
                    <Checkbox
                      id={style.label}
                      checked={isChecked}
                      onCheckedChange={() => toggleStyle(style.value)}
                    />
                    <Label htmlFor={style.label} className="cursor-pointer">
                      {style.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="minBudget">Minimum Budget (INR)</Label>
                <Input
                  id="minBudget"
                  type="number"
                  value={budget ? Number(budget.min) : ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setBudget({
                      min: BigInt(value),
                      max: budget ? budget.max : BigInt(0),
                      currency: 'INR',
                    });
                  }}
                  placeholder="50000"
                />
              </div>
              <div>
                <Label htmlFor="maxBudget">Maximum Budget (INR)</Label>
                <Input
                  id="maxBudget"
                  type="number"
                  value={budget ? Number(budget.max) : ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setBudget({
                      min: budget ? budget.min : BigInt(0),
                      max: BigInt(value),
                      currency: 'INR',
                    });
                  }}
                  placeholder="200000"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g., 2-3 months"
              />
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handleBack} disabled={step === 1}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()}>
              {step === totalSteps ? 'Review' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
