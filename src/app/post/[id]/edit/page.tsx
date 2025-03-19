'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Post } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [isOwner, setIsOwner] = useState(false);
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
        setPost(data);

        // Check if current user is the owner
        if (session?.user) {
          setIsOwner(session.user.id === data.user_id);
        }
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
    if (!post) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('posts')
        .update({
          title: post.title,
          content: post.content,
        })
        .eq('id', post.id)
        .eq('user_id', post.user_id); // Ensure only owner can update

      if (error) throw error;

      toast.success('Post updated successfully');
      router.push(`/post/${post.id}`);
      router.refresh();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
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

  if (!post || !isOwner) {
    return null;
  }

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <Input
              type="text"
              placeholder="Title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              required
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Write your post content here... (Markdown is supported)"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              required
              className="min-h-[300px]"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </main>
  );
} 