-- Create the posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    anonymous_author_id UUID NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read posts
CREATE POLICY "Allow public read access" ON public.posts
    FOR SELECT
    USING (true);

-- Create a policy that allows anyone to insert posts
CREATE POLICY "Allow public insert access" ON public.posts
    FOR INSERT
    WITH CHECK (true); 