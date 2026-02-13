import { useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send } from 'lucide-react';
import { useGetProjectBrief, useGetNotesForProject, useAddNote } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { formatDate, formatDateTime, formatINR } from '../../utils/format';
import { toast } from 'sonner';
import type { StylePreference, RoomType } from '../../backend';

function getStyleLabel(style: StylePreference): string {
  if ('__kind__' in style) {
    const labels: Record<string, string> = {
      modern: 'Modern',
      traditional: 'Traditional',
      contemporary: 'Contemporary',
      boho: 'Boho',
      minimalist: 'Minimalist',
      rustic: 'Rustic',
    };
    return labels[style.__kind__] || style.__kind__;
  }
  return 'Other';
}

function getRoomLabel(room: RoomType): string {
  if ('__kind__' in room) {
    const labels: Record<string, string> = {
      livingRoom: 'Living Room',
      bedroom: 'Bedroom',
      diningRoom: 'Dining Room',
      office: 'Home Office',
      kidsRoom: "Kids' Room",
    };
    return labels[room.__kind__] || room.__kind__;
  }
  return 'Other';
}

export default function ProjectWorkspacePage() {
  const { projectId } = useParams({ from: '/app/projects/$projectId' });
  const { identity } = useInternetIdentity();
  const { data: brief, isLoading: briefLoading } = useGetProjectBrief(projectId);
  const { data: notes, isLoading: notesLoading } = useGetNotesForProject(projectId);
  const addNote = useAddNote();
  const [newNote, setNewNote] = useState('');

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please sign in to add notes');
      return;
    }

    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    try {
      const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await addNote.mutateAsync({
        id: noteId,
        userId: identity.getPrincipal(),
        projectId,
        message: newNote.trim(),
        timestamp: BigInt(Date.now() * 1000000),
      });
      setNewNote('');
      toast.success('Note added successfully');
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add note. Please try again.');
    }
  };

  if (briefLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Project Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button asChild>
            <Link to="/app/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/app/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl">{getRoomLabel(brief.roomType)} Design</CardTitle>
                  <CardDescription>Created on {formatDate(brief.submissionDate)}</CardDescription>
                </div>
                <Badge>{brief.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold">Style Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {brief.stylePreferences.map((style, idx) => (
                    <Badge key={idx} variant="secondary">
                      {getStyleLabel(style)}
                    </Badge>
                  ))}
                </div>
              </div>

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
                  <h3 className="mb-2 font-semibold">Selected Package</h3>
                  <Badge>{brief.selectedPackage}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Notes</CardTitle>
              <CardDescription>
                Communicate with your designer and track project updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNote} className="mb-6">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a note or message..."
                  rows={3}
                  className="mb-2"
                />
                <Button type="submit" disabled={addNote.isPending}>
                  <Send className="mr-2 h-4 w-4" />
                  {addNote.isPending ? 'Sending...' : 'Add Note'}
                </Button>
              </form>

              <Separator className="my-6" />

              {notesLoading ? (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Loading notes...</p>
                </div>
              ) : notes && notes.length > 0 ? (
                <div className="space-y-4">
                  {notes
                    .sort((a, b) => Number(b.timestamp - a.timestamp))
                    .map((note) => (
                      <div key={note.id} className="rounded-lg border p-4">
                        <p className="mb-2 text-sm text-muted-foreground">
                          {formatDateTime(note.timestamp)}
                        </p>
                        <p className="whitespace-pre-wrap">{note.message}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    No notes yet. Add your first note to start the conversation.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/designers">Browse Designers</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/packages">View Packages</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
