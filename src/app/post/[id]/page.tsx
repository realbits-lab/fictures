'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Post } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

// Custom schema for rehype-sanitize to allow specific HTML elements and attributes
const schema = {
  ...rehypeSanitize.defaults,
  attributes: {
    ...rehypeSanitize.defaults.attributes,
    img: [...(rehypeSanitize.defaults.attributes.img || []), ['loading']],
    iframe: [
      ['src'],
      ['title'],
      ['width'],
      ['height'],
      ['allowfullscreen'],
      ['allow']
    ]
  },
  tagNames: [
    ...(rehypeSanitize.defaults.tagNames || []),
    'iframe',
    'audio',
    'video',
    'source'
  ]
};

export default function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data, error } = await supabase
          .from('blogs')
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

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', post.id)
        .eq('user_id', post.user_id); // Ensure only owner can delete

      if (error) throw error;

      toast.success('Post deleted successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
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
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/post/${post.id}/edit`)}
                className="shrink-0"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Anonymous #{post.user_id.slice(0, 8)}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              rehypePlugins={[
                [rehypeRaw],
                [rehypeSanitize, schema],
              ]}
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node, ...props }) => (
                  <img style={{ maxWidth: '100%', height: 'auto' }} loading="lazy" {...props} />
                ),
                iframe: ({ node, ...props }) => (
                  <div className="relative pt-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      {...props}
                    />
                  </div>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </main>
  );
} 