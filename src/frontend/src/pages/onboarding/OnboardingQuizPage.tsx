import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useOnboardingStore } from '../../state/onboardingStore';
import type { RoomType, StylePreference } from '../../backend';

const TOTAL_STEPS = 4;

export default function OnboardingQuizPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const {
    roomType,
    stylePreferences,
    budget,
    timeline,
    setRoomType,
    setStylePreferences,
    setBudget,
    setTimeline,
  } = useOnboardingStore();

  const [selectedRoom, setSelectedRoom] = useState<string>(
    roomType ? ('__kind__' in roomType ? roomType.__kind__ : 'other') : ''
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    stylePreferences.map((s) => ('__kind__' in s ? s.__kind__ : 'other'))
  );
  const [budgetMin, setBudgetMin] = useState(budget?.min ? Number(budget.min) : 50000);
  const [budgetMax, setBudgetMax] = useState(budget?.max ? Number(budget.max) : 200000);
  const [selectedTimeline, setSelectedTimeline] = useState(timeline || '');

  const handleNext = () => {
    if (currentStep === 1 && selectedRoom) {
      const roomTypeValue: RoomType =
        selectedRoom === 'livingRoom'
          ? { __kind__: 'livingRoom', livingRoom: null }
          : selectedRoom === 'bedroom'
          ? { __kind__: 'bedroom', bedroom: null }
          : selectedRoom === 'diningRoom'
          ? { __kind__: 'diningRoom', diningRoom: null }
          : selectedRoom === 'office'
          ? { __kind__: 'office', office: null }
          : selectedRoom === 'kidsRoom'
          ? { __kind__: 'kidsRoom', kidsRoom: null }
          : { __kind__: 'other', other: 'Other' };
      setRoomType(roomTypeValue);
    } else if (currentStep === 2 && selectedStyles.length > 0) {
      const styleValues: StylePreference[] = selectedStyles.map((style) => {
        switch (style) {
          case 'modern':
            return { __kind__: 'modern', modern: null };
          case 'traditional':
            return { __kind__: 'traditional', traditional: null };
          case 'contemporary':
            return { __kind__: 'contemporary', contemporary: null };
          case 'boho':
            return { __kind__: 'boho', boho: null };
          case 'minimalist':
            return { __kind__: 'minimalist', minimalist: null };
          case 'rustic':
            return { __kind__: 'rustic', rustic: null };
          default:
            return { __kind__: 'other', other: style };
        }
      });
      setStylePreferences(styleValues);
    } else if (currentStep === 3) {
      setBudget({
        min: BigInt(budgetMin),
        max: BigInt(budgetMax),
        currency: 'INR',
      });
    } else if (currentStep === 4 && selectedTimeline) {
      setTimeline(selectedTimeline);
      navigate({ to: '/onboarding/review' });
      return;
    }

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate({ to: '/' });
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedRoom !== '';
    if (currentStep === 2) return selectedStyles.length > 0;
    if (currentStep === 3) return budgetMin > 0 && budgetMax > budgetMin;
    if (currentStep === 4) return selectedTimeline !== '';
    return false;
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <Progress value={(currentStep / TOTAL_STEPS) * 100} className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Which room are you designing?'}
              {currentStep === 2 && "What's your style preference?"}
              {currentStep === 3 && "What's your budget range?"}
              {currentStep === 4 && "What's your timeline?"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Select the room type you want to transform'}
              {currentStep === 2 && 'Choose one or more styles that resonate with you'}
              {currentStep === 3 && 'Set your budget range in INR'}
              {currentStep === 4 && 'When would you like to complete this project?'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <RadioGroup value={selectedRoom} onValueChange={setSelectedRoom}>
                {[
                  { value: 'livingRoom', label: 'Living Room' },
                  { value: 'bedroom', label: 'Bedroom' },
                  { value: 'diningRoom', label: 'Dining Room' },
                  { value: 'office', label: 'Home Office' },
                  { value: 'kidsRoom', label: "Kids' Room" },
                  { value: 'other', label: 'Other' },
                ].map((room) => (
                  <div key={room.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={room.value} id={room.value} />
                    <Label htmlFor={room.value} className="cursor-pointer">
                      {room.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                {[
                  { value: 'modern', label: 'Modern' },
                  { value: 'traditional', label: 'Traditional' },
                  { value: 'contemporary', label: 'Contemporary' },
                  { value: 'boho', label: 'Boho' },
                  { value: 'minimalist', label: 'Minimalist' },
                  { value: 'rustic', label: 'Rustic' },
                ].map((style) => (
                  <div key={style.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={style.value}
                      checked={selectedStyles.includes(style.value)}
                      onCheckedChange={() => toggleStyle(style.value)}
                    />
                    <Label htmlFor={style.value} className="cursor-pointer">
                      {style.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetMin">Minimum Budget (₹)</Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    min="0"
                    step="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budgetMax">Maximum Budget (₹)</Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    min="0"
                    step="10000"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Budget range: ₹{budgetMin.toLocaleString('en-IN')} - ₹
                  {budgetMax.toLocaleString('en-IN')}
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <RadioGroup value={selectedTimeline} onValueChange={setSelectedTimeline}>
                {[
                  { value: '1-2 weeks', label: '1-2 weeks' },
                  { value: '3-4 weeks', label: '3-4 weeks' },
                  { value: '1-2 months', label: '1-2 months' },
                  { value: '3+ months', label: '3+ months' },
                  { value: 'Flexible', label: 'Flexible' },
                ].map((time) => (
                  <div key={time.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={time.value} id={time.value} />
                    <Label htmlFor={time.value} className="cursor-pointer">
                      {time.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canProceed()}>
                {currentStep === TOTAL_STEPS ? 'Review' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
