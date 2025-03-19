'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Post } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil } from 'lucide-react';

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setPost(data);

        // Check if current user is the owner
        const anonymousId = localStorage.getItem('anonymousId');
        setIsOwner(anonymousId === data.anonymous_author_id);
      } catch (error) {
        console.error('Error fetching post:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 max-w-lg mx-auto">
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
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
          <h1 className="text-2xl font-bold truncate flex-1">{post.title}</h1>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/post/${post.id}/edit`)}
              className="shrink-0"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit Post
            </Button>
          )}
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Anonymous #{post.anonymous_author_id.slice(0, 8)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>
    </main>
  );
} 