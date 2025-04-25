-- Create the users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  avatar_url TEXT,
  is_google_user BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to users
CREATE POLICY "Allow public read access"
  ON public.users FOR SELECT
  USING (true);

-- Create policy to allow authenticated inserts
CREATE POLICY "Allow authenticated insert"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to update their own records
CREATE POLICY "Allow users to update own record"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Create policy to allow users to delete their own records
CREATE POLICY "Allow users to delete own record"
  ON public.users FOR DELETE
  USING (auth.uid() = id); 