import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/Header';
import Footer from '@components/Footer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function LocationPage({ occupations, location }) {
  const router = useRouter();
  const formattedLocation = location.charAt(0).toUpperCase() + location.slice(1);

  return (
    <div className='container'>
      <Head>
        <title>Fire Them! All our Experts Occupations in {formattedLocation}.</title>
        <meta name="description" content={`Discover the various occupations available in ${formattedLocation} on our platform.`} />
        <meta name="keywords" content="occupations, online services, expertise, support" />
        <meta name="author" content="My Expert" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header title="Welcome to My Expert!" />
      <main className='category'>
        <h1>Occupations in {formattedLocation}</h1>
        <div className="sub-categories">
          {occupations.map((occupation) => (
            <a key={occupation.id} href={`/${location}/${occupation.occupation_slug}`} className="sub-category">
              <h2>{occupation.occupation_name} in {formattedLocation}</h2>
              <p>{occupation.occupation_desc}</p>
              <span>Discover the occupation</span>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

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

export async function getServerSideProps ({ params }) {
  const occupations = await fetchOccupations();
  const { location } = params;
  return {
    props: {
      occupations,
      location,
    },
  };
}