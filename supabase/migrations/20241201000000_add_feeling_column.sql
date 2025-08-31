-- Add feeling column to moments table
ALTER TABLE public.moments 
ADD COLUMN feeling text CHECK (feeling IN ('happy', 'neutral', 'sad'));

-- Add comment to explain the column
COMMENT ON COLUMN public.moments.feeling IS 'Emotional response to the memory: happy (positive), neutral, or sad (negative)';
