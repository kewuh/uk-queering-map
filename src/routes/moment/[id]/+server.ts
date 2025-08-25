import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/clients/supabaseClient';

export async function GET({ params }) {
  const { id } = params;

  console.log(`Fetching moment with id: ${id}`);

  // Fetch from Supabase
  const { data, error: dbError } = await supabase
    .from('moments')
    .select('description, short_id')
    .eq('short_id', id)
    .single();

  if (dbError) {
    console.error('Error fetching moment:', dbError);
    throw error(404, 'Description not found');
  }

  if (!data || !data.description) {
    console.log(`No moment found with short_id: ${id}`);
    throw error(404, 'Description not found');
  }

  console.log(`Found moment: ${data.description}`);
  return json({ short_id: id, description: data.description });
}
