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

function generateSlug(occupationName) {
  return occupationName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function generateOccupationData(occupations) {
  const occupationData = [];

  for (let i = 0; i < occupations.length; i++) {
    const occupation = occupations[i];

    if (occupation.occupation_desc && occupation.occupation_desc !== '') {
        console.log(`${i + 1}/${occupations.length} - ${occupation.occupation_name}`);
        continue;
      }

    const occupationPrompt = `
    Occupation Name: ${occupation.occupation_name}
    Description: Write a short, direct, and engaging description for this occupation.
    Response me only with the description, nothing else.
    Here is the description you wrote:
    `;

    console.log(`${i + 1}/${occupations.length} - ${occupation.occupation_name}`);

    const occupationResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
          { role: 'system', content: 'You are an assistant specialized in web writing and SEO' },
          { role: 'user', content: occupationPrompt }
      ],
    });

    const occupationDescriptions = occupationResponse.choices[0].message.content;

    const description = occupationDescriptions;
    const slug = generateSlug(occupation.occupation_name);

    const occupationDataItem = {
      occupation_name: occupation.occupation_name,
      occupation_desc: description,
      occupation_slug: slug,
    };

    occupationData.push(occupationDataItem);

    await updateOccupationsInDB(occupationDataItem);
  }

  return occupationData;
}

async function fetchOccupations() {
  const { data, error } = await supabase
    .from('occupations')
    .select('occupation_name, occupation_desc, occupation_slug')

  if (error) {
    console.error('Error fetching occupations:', error);
    return [];
  }

  return data;
}

async function updateOccupationsInDB(occupation) {
  const { data, error } = await supabase
    .from('occupations')
    .update({
      occupation_desc: occupation.occupation_desc,
      occupation_slug: occupation.occupation_slug,
    })
    .eq('occupation_name', occupation.occupation_name);

  if (error) {
    console.error(`Error updating occupation ${occupation.occupation_name}:`, error);
  }
}

async function updateOccupations() {
  const occupations = await fetchOccupations();
  await generateOccupationData(occupations);
}

updateOccupations();