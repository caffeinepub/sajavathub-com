import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRequestConsultation } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';

export default function ConsultationRequestForm() {
  const { identity } = useInternetIdentity();
  const requestConsultation = useRequestConsultation();
  const [requestedDate, setRequestedDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please sign in to request a consultation');
      return;
    }

    if (!requestedDate) {
      toast.error('Please select a preferred date');
      return;
    }

    try {
      const requestId = `consult_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const requestedTime = BigInt(new Date(requestedDate).getTime() * 1000000);

      await requestConsultation.mutateAsync({
        id: requestId,
        userId: identity.getPrincipal(),
        projectId: undefined,
        requestedTime,
        notes: notes.trim(),
        status: 'Pending',
        submissionDate: BigInt(Date.now() * 1000000),
      });

      toast.success('Consultation request submitted!');
      setRequestedDate('');
      setNotes('');
    } catch (error) {
      console.error('Failed to request consultation:', error);
      toast.error('Failed to submit request. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Consultation</CardTitle>
        <CardDescription>Schedule a call with our design team</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Preferred Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific topics you'd like to discuss?"
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={requestConsultation.isPending}>
            {requestConsultation.isPending ? 'Submitting...' : 'Request Consultation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
