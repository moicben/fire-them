import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import Header from '../components/Header';
import Head from 'next/head';
import { useRouter } from 'next/router';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchLocations() { 
  const { data, error } = await supabase
    .from('locations')
    .select('*');

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }

  return data;
}

export async function getServerSideProps ({ query }) {
  const locations = await fetchLocations();
  const job = query.job || null;
  return {
    props: {
      locations,
      job,
    },
  };
}

export default function LocationsPage({ locations, job }) {
  const jobName = job ? job.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All';

  return (
    <div className='container'>
      <Head>
        <title>{jobName} Experts Locations - Fire Them!</title>
        <meta name="description" content="Discover the various locations available on our platform." />
        <meta name="keywords" content="locations, online services, expertise, support" />
        <meta name="author" content="My Expert" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Welcome to My Expert!" />
      
      <div className="category">
        <h1>{`${jobName} Locations`}</h1>
        <div className="sub-categories">
          {locations.map((location) => (
            <a key={location.id} href={`/${location.location_slug}`} className="sub-category">
              <h2>{location.location_name}</h2>
              <p>{location.location_desc}</p>
              <span>Discover the location</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}