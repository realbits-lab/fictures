'use client';

import { useEffect, useState } from 'react';
import { supabase, type Post } from '@/lib/supabase';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { useInView } from 'react-intersection-observer';

export default function BlogFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const { ref, inView } = useInView();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(page * 10, (page + 1) * 10 - 1);

      if (error) throw error;

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
    if (inView) {
      fetchPosts();
    }
  }, [inView]);

  return (
    <div className="space-y-4 py-4">
      {posts.map((post) => (
        <Card key={post.id} className="w-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Anonymous #{post.anonymous_author_id.slice(0, 8)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
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