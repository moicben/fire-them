import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import Header from '../components/Header';
import Head from 'next/head';

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

export async function getServerSideProps () {
  const occupations = await fetchOccupations();
  return {
    props: {
      occupations,
    },
  };
}

export default function OccupationsPage({ occupations }) {
  return (
    <div className='container'>
      <Head>
        <title>Fire Them! All our Experts Occupations.</title>
        <meta name="description" content="Discover the various occupations available on our platform." />
        <meta name="keywords" content="occupations, online services, expertise, support" />
        <meta name="author" content="My Expert" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Welcome to My Expert!" />
    
      <div className="category">
        <h1>All Experts Occupations</h1>
        <div className="sub-categories">
          {occupations.map((occupation) => (
            <a key={occupation.id} href={`/occupations/locations?job=${occupation.occupation_slug}`} className="sub-category">
              <h2>{occupation.occupation_name}</h2>
              <p>{occupation.occupation_desc}</p>
              <span>Discover the occupation</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}