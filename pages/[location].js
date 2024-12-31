import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import Header from '../components/Header';
import Head from 'next/head';
import { useRouter } from 'next/router';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchOccupations() {
  const { data, error } = await supabase
    .from('occupations')
    .select('*');

  if (error) {
    console.error('Error fetching occupations:', error);
    return [];
  }

  return data;
}

export async function getStaticPaths() {
  const { data: locations, error } = await supabase
    .from('locations')
    .select('location_slug');

  if (error) {
    console.error('Error fetching locations:', error);
    return { paths: [], fallback: false };
  }

  const paths = locations.map(location => ({
    params: { location: location.location_slug.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const occupations = await fetchOccupations();
  return {
    props: {
      occupations,
      location: params.location,
    },
  };
}

export default function LocationPage({ occupations }) {
  const router = useRouter();
  const { location } = router.query;

  return (
    <div className='container'>
      <Head>
        <title>Fire Them! All our Experts Occupations in {location}.</title>
        <meta name="description" content={`Discover the various occupations available in ${location} on our platform.`} />
        <meta name="keywords" content="occupations, online services, expertise, support" />
        <meta name="author" content="My Expert" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Welcome to My Expert!" />
      
      <div className="category">
        <h1>Occupations in {location}</h1>
        <div className="sub-categories">
          {occupations.map((occupation) => (
            <a key={occupation.id} href={`${location}/${occupation.occupation_slug}`} className="sub-category">
              <h2>{occupation.occupation_name} in {location}</h2>
              <p>{occupation.occupation_desc}</p>
              <span>Discover the occupation</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}