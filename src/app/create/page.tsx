'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ensureAuthenticatedUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user.id) {
        return session.user.id;
      }
      
      const { data: { session: newSession }, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      if (!newSession?.user.id) throw new Error('Failed to create anonymous user');
      
      return newSession.user.id;
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent multiple submissions
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      
      const userId = await ensureAuthenticatedUser();
      
      const { error } = await supabase.from('posts').insert({
        title: title.trim(),
        content: content.trim(),
        user_id: userId,
      });

      if (error) throw error;

      // Only navigate if post creation was successful
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
      setIsSubmitting(false); // Reset submit state on error
    }
  };

  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b mb-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Fictures
          </Link>
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Link href="/">
            <Button variant="outline" type="button" disabled={isSubmitting}>Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </main>
  );
} 