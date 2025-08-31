-- Add featured column to moments table
ALTER TABLE public.moments 
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Add comment to explain the column
COMMENT ON COLUMN public.moments.featured IS 'Whether this story is featured/promoted on the map';
