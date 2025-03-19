'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', resolvedParams.id)
          .single();

        if (error) throw error;
        
        // Verify ownership
        if (!session?.user || data.user_id !== session.user.id) {
          toast.error('You do not have permission to edit this post');
          router.push('/');
          return;
        }

        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        console.error('Error fetching post:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [resolvedParams.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('You must be logged in to edit a post');
        return;
      }

      const { error } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content: content.trim(),
        })
        .eq('id', resolvedParams.id)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Supabase error:', error);
        toast.error(`Failed to update post: ${error.message}`);
        return;
      }
      
      toast.success('Post updated successfully');
      router.push(`/post/${resolvedParams.id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update post: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 max-w-lg mx-auto">
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Post</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            required
          />
        </div>
        <div className="space-y-2">
          <Textarea
            placeholder="Write your post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
            maxLength={2000}
            required
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </main>
  );
} 