'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Post } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

// Custom schema for rehype-sanitize to allow specific HTML elements and attributes
const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img || []), ['loading']],
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
    ...(defaultSchema.tagNames || []),
    'iframe',
    'audio',
    'video',
    'source'
  ]
};

export default function BlogFeed() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setCurrentUserId(session?.user?.id || null);

        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCardClick = (post: Post) => {
    if (post.id) {
      router.push(`/post/${encodeURIComponent(post.id)}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (postId) {
      router.push(`/post/${encodeURIComponent(postId)}/edit`);
    }
  };

  if (posts.length === 0 && !loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-muted-foreground">No posts yet. Be the first to write something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {posts.map((post) => (
        <Card 
          key={`${post.id}-${post.created_at}`}
          className="w-full cursor-pointer transition-all hover:shadow-md"
          onClick={() => handleCardClick(post)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Anonymous #{post.user_id.slice(0, 8)}
                </span>
                {currentUserId === post.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={(e) => handleEditClick(e, post.id)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="ml-1">Edit</span>
                  </Button>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none line-clamp-3">
              <ReactMarkdown
                rehypePlugins={[
                  [rehypeRaw],
                  [rehypeSanitize, schema],
                ]}
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => (
                    <img style={{ maxWidth: '100%', height: '100px', objectFit: 'cover' }} loading="lazy" {...props} />
                  ),
                  iframe: ({ node, ...props }) => (
                    <div className="relative" style={{ height: '100px' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        {...props}
                      />
                    </div>
                  ),
                  audio: ({ node, ...props }) => (
                    <audio controls style={{ height: '40px', width: '100%' }} {...props} />
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ))}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
} 