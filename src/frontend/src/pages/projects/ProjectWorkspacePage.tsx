import { useParams, Link } from '@tanstack/react-router';
import { useGetProjectBrief, useGetNotesForProject, useAddNote } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { formatINR, formatDateTime } from '../../utils/format';
import type { ProjectNote } from '../../backend';

export default function ProjectWorkspacePage() {
  const { projectId } = useParams({ from: '/projects/$projectId' });
  const { identity } = useInternetIdentity();
  const [noteMessage, setNoteMessage] = useState('');

  const { data: brief, isLoading: briefLoading, error: briefError } = useGetProjectBrief(projectId);
  const { data: notes, isLoading: notesLoading } = useGetNotesForProject(projectId);
  const addNoteMutation = useAddNote();

  const handleAddNote = async () => {
    if (!identity || !noteMessage.trim()) return;

    const note: ProjectNote = {
      id: `note-${Date.now()}`,
      userId: identity.getPrincipal(),
      projectId,
      message: noteMessage.trim(),
      timestamp: BigInt(Date.now() * 1000000),
    };

    try {
      await addNoteMutation.mutateAsync(note);
      setNoteMessage('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  if (briefLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="mb-8 h-12 w-64" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (briefError || !brief) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load project details. Please try again later.
          </AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatRoomType = (rt: any): string => {
    if (typeof rt === 'object' && rt !== null) {
      const key = Object.keys(rt)[0];
      return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    }
    return String(rt);
  };

  const sortedNotes = notes ? [...notes].sort((a, b) => Number(a.timestamp) - Number(b.timestamp)) : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
          {formatRoomType(brief.roomType)} Project
        </h1>
        <Badge variant={brief.status === 'active' ? 'default' : 'secondary'}>
          {brief.status}
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Budget Range</h3>
                <p className="text-muted-foreground">
                  {formatINR(brief.budget.min)} - {formatINR(brief.budget.max)}
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Timeline</h3>
                <p className="text-muted-foreground">{brief.timeline}</p>
              </div>
              {brief.selectedPackage && (
                <div>
                  <h3 className="mb-2 font-semibold">Package</h3>
                  <Badge>{brief.selectedPackage}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Notes</CardTitle>
              <CardDescription>Communication thread with your designer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 space-y-4">
                {notesLoading ? (
                  <Skeleton className="h-24 w-full" />
                ) : sortedNotes.length === 0 ? (
                  <p className="text-center text-muted-foreground">No notes yet. Start the conversation!</p>
                ) : (
                  sortedNotes.map((note) => (
                    <div key={note.id} className="rounded-lg border p-4">
                      <p className="mb-2">{note.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(note.timestamp)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Add a note or question..."
                  value={noteMessage}
                  onChange={(e) => setNoteMessage(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={handleAddNote}
                  disabled={!noteMessage.trim() || addNoteMutation.isPending}
                  className="w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {addNoteMutation.isPending ? 'Sending...' : 'Send Note'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your designer will review your project brief and reach out with initial concepts.
              </p>
              <p className="text-sm text-muted-foreground">
                Use the notes section to communicate with your designer and share feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
