'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAnonymousUser = async (userId: string) => {
    const { error } = await supabase.from('users').insert({
      id: userId,
      is_anonymous: true,
      is_sso_user: false,
    });
    
    if (error && error.code !== '23505') { // Ignore unique violation errors
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      
      // Get or create user ID
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }

      // Ensure anonymous user exists
      await createAnonymousUser(userId);
      
      // Create the post
      const { error } = await supabase.from('posts').insert({
        title: title.trim(),
        content: content.trim(),
        user_id: userId,
      });

      if (error) throw error;
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
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
          <Link href="/">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </main>
  );
} 