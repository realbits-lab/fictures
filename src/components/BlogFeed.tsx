'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Post } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function BlogFeed() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const { ref, inView } = useInView();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the user ID from localStorage
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * 10, (page + 1) * 10 - 1);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data) {
        setPosts(prevPosts => [...prevPosts, ...data]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (inView && posts.length > 0) {
      fetchPosts();
    }
  }, [inView]);

  const handleCardClick = (post: Post) => {
    if (post.id) {
      router.push(`/post/${encodeURIComponent(post.id)}`);
    }
  };

  const handleEditClick = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // Prevent card click event
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
          key={post.id} 
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
            <p className="text-sm whitespace-pre-wrap line-clamp-3">{post.content}</p>
          </CardContent>
        </Card>
      ))}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div ref={ref} className="h-10" />
    </div>
  );
} 