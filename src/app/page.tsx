import BlogFeed from '@/components/BlogFeed';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 max-w-lg mx-auto">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Fictures</h1>
          <Link href="/create">
            <Button>Write a post</Button>
          </Link>
        </div>
      </div>
      <BlogFeed />
    </main>
  );
}
