    import { createClient } from '@supabase/supabase-js';
    import dotenv from 'dotenv';
    import Header from '../../components/Header';
    import Head from 'next/head';
    
    dotenv.config();
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    async function fetchOccupationBySlug(slug) {
      console.log('Fetching occupation with slug:', slug); // Log the slug
      const { data, error } = await supabase
        .from('occupations')
        .select('*')
        .eq('occupation_slug', slug)
        .single();
    
      if (error) {
        console.error('Error fetching occupation:', error);
        return null;
      }
    
      console.log('Fetched occupation data:', data); // Log the fetched data
      return data;
    }
    
    async function fetchLocationBySlug(slug) {
      console.log('Fetching location with slug:', slug); // Log the slug
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('location_slug', slug)
        .single();
    
      if (error) {
        console.error('Error fetching location:', error);
        return null;
      }
    
      console.log('Fetched location data:', data); // Log the fetched data
      return data;
    }
    
    export async function getStaticPaths() {
      const { data: occupations, error } = await supabase
        .from('occupations')
        .select('occupation_slug');
    
      if (error) {
        console.error('Error fetching occupations:', error);
        return { paths: [], fallback: false };
      }
    
      const { data: locations, error: locationError } = await supabase
        .from('locations')
        .select('location_slug');
    
      if (locationError) {
        console.error('Error fetching locations:', locationError);
        return { paths: [], fallback: false };
      }
    
      const paths = [];
    
      occupations.forEach((occupation) => {
        locations.forEach((location) => {
          paths.push({
            params: {
              location: location.location_slug.toString().replace(/^\/|\/$/g, ''),
              occupation: occupation.occupation_slug.toString().replace(/^\/|\/$/g, '')
            },
          });
        });
      });
    
      return { paths, fallback: false };
    }
    
    export async function getStaticProps({ params }) {
      console.log('Params:', params); // Log the params
      const occupation = await fetchOccupationBySlug(params.occupation);
      const location = await fetchLocationBySlug(params.location);
    
      if (!occupation || !location) {
        return {
          notFound: true,
        };
      }
    
      return {
        props: {
          occupation,
          location, // Pass location as a prop
        },
      };
    }
    
    export default function OccupationPage({ occupation, location }) {
      if (!occupation) {
        return <div>Occupation not found</div>;
      }
    
      return (
        <div className='container'>
          <Head>
            <title>{`${occupation.occupation_name} in ${location.location_name} - Fire Them!`}</title>
            <meta name="description" content={`${occupation.occupation_desc} in ${location.location_name}`} />
            <meta name="keywords" content="occupations, online services, expertise, support" />
            <meta name="author" content="My Expert" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header title="Welcome to My Expert!" />
          
          <div className="category">
            <h1>{occupation.occupation_name} in {location.location_name}</h1> {/* Display location */}
            <div className="sub-category-content">
              <p>{occupation.occupation_desc}</p>
              <span>Discover the occupation</span>
            </div>
          </div>
    
          <div className="category">
            <h2>Details about {location.location_name}</h2>
            <p>{location.location_desc}</p>
          </div>
        </div>
      );
    }