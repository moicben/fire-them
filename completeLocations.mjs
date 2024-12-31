import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { OpenAI } from 'openai';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateSlug(locationName) {
  return locationName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateLocationData(locations) {
  const locationData = [];

  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];

    if (location.location_desc) {
      console.log(`${i + 1}/${locations.length} - ${location.location_name}`);
      continue;
    }

    const locationPrompt = `
    Location Name: ${location.location_name}
    Description: Write a short, singular, and unique description for this location.
    Response me only with the description, nothing else.
    Here is the description your wrote:
    `;

    console.log(`${i + 1}/${locations.length} - ${location.location_name}`);

    const locationResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
          { role: 'system', content: 'You are an assistant specialized in web writing and SEO' },
          { role: 'user', content: locationPrompt }
      ],
    });

    const locationDescriptions = locationResponse.choices[0].message.content;

    const description = locationDescriptions;
    const slug = generateSlug(location.location_name);

    const locationDataItem = {
      location_name: location.location_name,
      location_desc: description,
      location_slug: slug,
    };

    locationData.push(locationDataItem);

    await updateLocationsInDB(locationDataItem);
  }

  return locationData;
}

async function fetchLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('location_name, location_desc, location_slug');

  if (error) {
    console.error('Error fetching locations:', error);
    return [];
  }

  return data;
}

async function updateLocationsInDB(location) {
  const { data, error } = await supabase
    .from('locations')
    .update({
      location_desc: location.location_desc,
      location_slug: location.location_slug,
    })
    .eq('location_name', location.location_name);

  if (error) {
    console.error(`Error updating location ${location.location_name}:`, error);
  } else {
   // console.log(`Successfully updated location ${location.location_name}`);
  }
}

async function updateLocations() {
  const locations = await fetchLocations();
  await generateLocationData(locations);
}

updateLocations();