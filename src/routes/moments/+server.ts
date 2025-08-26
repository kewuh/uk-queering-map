import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/clients/supabaseClient';

// Inline the moments data to avoid file system issues in deployment
const momentsData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 1,
      geometry: { type: 'Point', coordinates: [-7.080254, 57.721735] }
    },
    {
      type: 'Feature',
      id: 2,
      geometry: { type: 'Point', coordinates: [0.208137, 52.586255] }
    },
    {
      type: 'Feature',
      id: 3,
      geometry: { type: 'Point', coordinates: [-2.099731, 60.210495] }
    },
    {
      type: 'Feature',
      id: 4,
      geometry: { type: 'Point', coordinates: [-0.313315, 52.370126] }
    },
    {
      type: 'Feature',
      id: 5,
      geometry: { type: 'Point', coordinates: [-5.345307, 59.651955] }
    },
    {
      type: 'Feature',
      id: 6,
      geometry: { type: 'Point', coordinates: [-4.504757, 49.329014] }
    },
    {
      type: 'Feature',
      id: 7,
      geometry: { type: 'Point', coordinates: [-4.19556, 55.181631] }
    },
    {
      type: 'Feature',
      id: 8,
      geometry: { type: 'Point', coordinates: [-8.352596, 51.075097] }
    },
    {
      type: 'Feature',
      id: 9,
      geometry: { type: 'Point', coordinates: [-2.442455, 53.64423] }
    },
    {
      type: 'Feature',
      id: 10,
      geometry: { type: 'Point', coordinates: [-5.414668, 58.760801] }
    },
    {
      type: 'Feature',
      id: 11,
      geometry: { type: 'Point', coordinates: [-7.755169, 50.808939] }
    },
    {
      type: 'Feature',
      id: 12,
      geometry: { type: 'Point', coordinates: [-6.427086, 54.3151] }
    },
    {
      type: 'Feature',
      id: 13,
      geometry: { type: 'Point', coordinates: [1.540036, 56.386803] }
    },
    {
      type: 'Feature',
      id: 14,
      geometry: { type: 'Point', coordinates: [0.843684, 57.010262] }
    },
    {
      type: 'Feature',
      id: 15,
      geometry: { type: 'Point', coordinates: [-2.652325, 49.53809] }
    },
    {
      type: 'Feature',
      id: 16,
      geometry: { type: 'Point', coordinates: [-4.880043, 51.228492] }
    },
    {
      type: 'Feature',
      id: 17,
      geometry: { type: 'Point', coordinates: [0.736294, 52.049177] }
    },
    {
      type: 'Feature',
      id: 18,
      geometry: { type: 'Point', coordinates: [-0.411016, 60.298266] }
    },
    {
      type: 'Feature',
      id: 19,
      geometry: { type: 'Point', coordinates: [-1.349718, 56.152814] }
    },
    {
      type: 'Feature',
      id: 20,
      geometry: { type: 'Point', coordinates: [-0.670201, 57.309208] }
    },
    {
      type: 'Feature',
      id: 21,
      geometry: { type: 'Point', coordinates: [1.112925, 55.445733] }
    },
    {
      type: 'Feature',
      id: 22,
      geometry: { type: 'Point', coordinates: [-6.042821, 59.608211] }
    },
    {
      type: 'Feature',
      id: 23,
      geometry: { type: 'Point', coordinates: [-4.517561, 52.070677] }
    },
    {
      type: 'Feature',
      id: 24,
      geometry: { type: 'Point', coordinates: [-2.573275, 57.637831] }
    },
    {
      type: 'Feature',
      id: 25,
      geometry: { type: 'Point', coordinates: [-1.240292, 50.472649] }
    },
    {
      type: 'Feature',
      id: 26,
      geometry: { type: 'Point', coordinates: [-6.986575, 54.856561] }
    },
    {
      type: 'Feature',
      id: 27,
      geometry: { type: 'Point', coordinates: [-0.156132, 53.783884] }
    },
    {
      type: 'Feature',
      id: 28,
      geometry: { type: 'Point', coordinates: [-1.896977, 49.406068] }
    },
    {
      type: 'Feature',
      id: 29,
      geometry: { type: 'Point', coordinates: [-1.362127, 53.939872] }
    },
    {
      type: 'Feature',
      id: 30,
      geometry: { type: 'Point', coordinates: [-8.094243, 53.321848] }
    },
    {
      type: 'Feature',
      id: 31,
      geometry: { type: 'Point', coordinates: [-2.14066, 60.684071] }
    },
    {
      type: 'Feature',
      id: 32,
      geometry: { type: 'Point', coordinates: [0.124723, 53.256185] }
    },
    {
      type: 'Feature',
      id: 33,
      geometry: { type: 'Point', coordinates: [-1.143848, 57.424712] }
    },
    {
      type: 'Feature',
      id: 34,
      geometry: { type: 'Point', coordinates: [0.924169, 60.666427] }
    },
    {
      type: 'Feature',
      id: 35,
      geometry: { type: 'Point', coordinates: [-7.054657, 50.074096] }
    },
    {
      type: 'Feature',
      id: 36,
      geometry: { type: 'Point', coordinates: [-0.947171, 58.100704] }
    },
    {
      type: 'Feature',
      id: 37,
      geometry: { type: 'Point', coordinates: [-2.661825, 49.827975] }
    },
    {
      type: 'Feature',
      id: 38,
      geometry: { type: 'Point', coordinates: [-2.639724, 59.292123] }
    },
    {
      type: 'Feature',
      id: 39,
      geometry: { type: 'Point', coordinates: [-6.816335, 60.203273] }
    },
    {
      type: 'Feature',
      id: 40,
      geometry: { type: 'Point', coordinates: [-8.358554, 54.251771] }
    },
    {
      type: 'Feature',
      id: 41,
      geometry: { type: 'Point', coordinates: [-1.213899, 55.860531] }
    },
    {
      type: 'Feature',
      id: 42,
      geometry: { type: 'Point', coordinates: [-5.055822, 58.321859] }
    },
    {
      type: 'Feature',
      id: 43,
      geometry: { type: 'Point', coordinates: [-0.325598, 59.193217] }
    },
    {
      type: 'Feature',
      id: 44,
      geometry: { type: 'Point', coordinates: [-8.109113, 55.112909] }
    },
    {
      type: 'Feature',
      id: 45,
      geometry: { type: 'Point', coordinates: [-1.832645, 56.794444] }
    },
    {
      type: 'Feature',
      id: 46,
      geometry: { type: 'Point', coordinates: [-5.607153, 58.036355] }
    },
    {
      type: 'Feature',
      id: 47,
      geometry: { type: 'Point', coordinates: [-6.311849, 53.357272] }
    },
    {
      type: 'Feature',
      id: 48,
      geometry: { type: 'Point', coordinates: [-4.987014, 55.356886] }
    },
    {
      type: 'Feature',
      id: 49,
      geometry: { type: 'Point', coordinates: [-3.594836, 58.437026] }
    },
    {
      type: 'Feature',
      id: 50,
      geometry: { type: 'Point', coordinates: [-7.358096, 51.344826] }
    },
    {
      type: 'Feature',
      id: 51,
      geometry: { type: 'Point', coordinates: [-5.347246, 53.185688] }
    },
    {
      type: 'Feature',
      id: 52,
      geometry: { type: 'Point', coordinates: [-0.021107, 56.066607] }
    },
    {
      type: 'Feature',
      id: 53,
      geometry: { type: 'Point', coordinates: [-4.233905, 51.307934] }
    },
    {
      type: 'Feature',
      id: 54,
      geometry: { type: 'Point', coordinates: [-7.493519, 55.973302] }
    },
    {
      type: 'Feature',
      id: 55,
      geometry: { type: 'Point', coordinates: [-7.72058, 56.797037] }
    },
    {
      type: 'Feature',
      id: 56,
      geometry: { type: 'Point', coordinates: [-6.984849, 57.92718] }
    },
    {
      type: 'Feature',
      id: 57,
      geometry: { type: 'Point', coordinates: [-0.824128, 54.888466] }
    },
    {
      type: 'Feature',
      id: 58,
      geometry: { type: 'Point', coordinates: [-8.097712, 50.694103] }
    },
    {
      type: 'Feature',
      id: 59,
      geometry: { type: 'Point', coordinates: [0.776841, 54.592525] }
    },
    {
      type: 'Feature',
      id: 60,
      geometry: { type: 'Point', coordinates: [-7.656929, 49.693295] }
    },
    {
      type: 'Feature',
      id: 61,
      geometry: { type: 'Point', coordinates: [-8.505221, 59.145001] }
    },
    {
      type: 'Feature',
      id: 62,
      geometry: { type: 'Point', coordinates: [-4.484876, 49.267528] }
    },
    {
      type: 'Feature',
      id: 63,
      geometry: { type: 'Point', coordinates: [1.534021, 60.672744] }
    },
    {
      type: 'Feature',
      id: 64,
      geometry: { type: 'Point', coordinates: [-3.946874, 57.78925] }
    },
    {
      type: 'Feature',
      id: 65,
      geometry: { type: 'Point', coordinates: [-4.978485, 52.191786] }
    },
    {
      type: 'Feature',
      id: 66,
      geometry: { type: 'Point', coordinates: [1.280777, 55.434654] }
    },
    {
      type: 'Feature',
      id: 67,
      geometry: { type: 'Point', coordinates: [-7.697165, 53.330699] }
    },
    {
      type: 'Feature',
      id: 68,
      geometry: { type: 'Point', coordinates: [-5.755199, 51.129408] }
    },
    {
      type: 'Feature',
      id: 69,
      geometry: { type: 'Point', coordinates: [-0.337885, 52.663926] }
    },
    {
      type: 'Feature',
      id: 70,
      geometry: { type: 'Point', coordinates: [1.101924, 52.494953] }
    },
    {
      type: 'Feature',
      id: 71,
      geometry: { type: 'Point', coordinates: [-4.222403, 50.172776] }
    },
    {
      type: 'Feature',
      id: 72,
      geometry: { type: 'Point', coordinates: [-3.936555, 52.117448] }
    },
    {
      type: 'Feature',
      id: 73,
      geometry: { type: 'Point', coordinates: [-4.461991, 60.537159] }
    },
    {
      type: 'Feature',
      id: 74,
      geometry: { type: 'Point', coordinates: [1.468855, 51.828117] }
    },
    {
      type: 'Feature',
      id: 75,
      geometry: { type: 'Point', coordinates: [-8.233474, 52.745644] }
    },
    {
      type: 'Feature',
      id: 76,
      geometry: { type: 'Point', coordinates: [-5.687717, 60.741487] }
    },
    {
      type: 'Feature',
      id: 77,
      geometry: { type: 'Point', coordinates: [0.966722, 49.599264] }
    },
    {
      type: 'Feature',
      id: 78,
      geometry: { type: 'Point', coordinates: [-2.07597, 54.020558] }
    },
    {
      type: 'Feature',
      id: 79,
      geometry: { type: 'Point', coordinates: [-4.032393, 51.542069] }
    },
    {
      type: 'Feature',
      id: 80,
      geometry: { type: 'Point', coordinates: [-5.144461, 54.248515] }
    },
    {
      type: 'Feature',
      id: 81,
      geometry: { type: 'Point', coordinates: [-6.048626, 53.112393] }
    },
    {
      type: 'Feature',
      id: 82,
      geometry: { type: 'Point', coordinates: [-7.873107, 56.244655] }
    },
    {
      type: 'Feature',
      id: 83,
      geometry: { type: 'Point', coordinates: [-3.769206, 56.836068] }
    },
    {
      type: 'Feature',
      id: 84,
      geometry: { type: 'Point', coordinates: [-7.493573, 54.815383] }
    },
    {
      type: 'Feature',
      id: 85,
      geometry: { type: 'Point', coordinates: [-0.799147, 50.407432] }
    },
    {
      type: 'Feature',
      id: 86,
      geometry: { type: 'Point', coordinates: [1.066543, 52.477577] }
    },
    {
      type: 'Feature',
      id: 87,
      geometry: { type: 'Point', coordinates: [-8.627855, 59.783265] }
    },
    {
      type: 'Feature',
      id: 88,
      geometry: { type: 'Point', coordinates: [-4.454452, 50.301133] }
    },
    {
      type: 'Feature',
      id: 89,
      geometry: { type: 'Point', coordinates: [-7.034086, 56.60716] }
    },
    {
      type: 'Feature',
      id: 90,
      geometry: { type: 'Point', coordinates: [-2.426423, 50.488562] }
    },
    {
      type: 'Feature',
      id: 91,
      geometry: { type: 'Point', coordinates: [-8.001073, 57.047083] }
    },
    {
      type: 'Feature',
      id: 92,
      geometry: { type: 'Point', coordinates: [-5.86782, 50.204813] }
    },
    {
      type: 'Feature',
      id: 93,
      geometry: { type: 'Point', coordinates: [0.79426, 54.154296] }
    },
    {
      type: 'Feature',
      id: 94,
      geometry: { type: 'Point', coordinates: [-2.994723, 54.846366] }
    },
    {
      type: 'Feature',
      id: 95,
      geometry: { type: 'Point', coordinates: [0.194278, 51.246425] }
    },
    {
      type: 'Feature',
      id: 96,
      geometry: { type: 'Point', coordinates: [-8.234204, 56.148055] }
    },
    {
      type: 'Feature',
      id: 97,
      geometry: { type: 'Point', coordinates: [-7.551006, 59.511089] }
    },
    {
      type: 'Feature',
      id: 98,
      geometry: { type: 'Point', coordinates: [-4.793741, 49.784403] }
    },
    {
      type: 'Feature',
      id: 99,
      geometry: { type: 'Point', coordinates: [-4.031405, 54.757708] }
    },
    {
      type: 'Feature',
      id: 100,
      geometry: { type: 'Point', coordinates: [-5.138421, 59.197091] }
    }
  ]
};

export const GET: RequestHandler = async () => {
  console.log('Fetching moments from Supabase...');

  // Debug environment variables
  console.log('SUPABASE_URL available:', !!process.env.SUPABASE_URL);
  console.log('VITE_SUPABASE_URL available:', !!process.env.VITE_SUPABASE_URL);
  console.log('SUPABASE_ANON_KEY available:', !!process.env.SUPABASE_ANON_KEY);
  console.log(
    'VITE_SUPABASE_ANON_KEY available:',
    !!process.env.VITE_SUPABASE_ANON_KEY
  );

  // Fetch approved moments from Supabase
  const { data, error } = await supabase
    .from('moments')
    .select('short_id, location, description')
    .eq('status', 'approved');

  if (error) {
    console.error('Error fetching moments:', error);
    console.log('Falling back to sample data');
    // Fallback to sample data if database query fails
    return json(momentsData);
  }

  console.log(`Found ${data?.length || 0} approved moments in database`);
  console.log('Sample data:', data?.slice(0, 2)); // Show first 2 records

  if (!data || data.length === 0) {
    console.log('No approved moments found, returning empty map');
    return json({
      type: 'FeatureCollection',
      features: []
    });
  }

  // Convert database data to GeoJSON format
  const geoJsonData = {
    type: 'FeatureCollection',
    features: data.map((moment) => {
      // Handle the location data safely
      let coordinates = [0, 0];
      if (moment.location && typeof moment.location === 'object') {
        const location = moment.location as { coordinates?: number[] };
        if (location.coordinates && Array.isArray(location.coordinates)) {
          coordinates = location.coordinates;
        }
      }

      const feature = {
        type: 'Feature',
        id: moment.short_id,
        geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        properties: {
          description: moment.description
        }
      };

      console.log(`Created feature for moment ${moment.short_id}:`, feature);
      return feature;
    })
  };

  console.log(
    'Returning real database data with',
    geoJsonData.features.length,
    'features'
  );
  return json(geoJsonData);
};

export const POST: RequestHandler = async ({ request }) => {
  const { lng, lat, description } = await request.json();

  if (!description?.trim()) {
    return json({ error: 'Description cannot be empty.' }, { status: 400 });
  }

  const { error } = await supabase.from('moments').insert([
    {
      description,
      location: `SRID=4326;POINT(${lng} ${lat})`,
      status: 'approved'
    }
  ]);

  if (error) {
    return json({ error: 'Error saving new moment' }, { status: 500 });
  }

  return json({}, { status: 201 });
};
