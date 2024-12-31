import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { OpenAI } from 'openai';

// Charger la clé API OpenAI à partir des variables d'environnement
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fonction pour générer la liste des métiers pertinents pour le web, la tech et les startups
async function generateOccupations(count) {
  const prompt = `
  Generate a list of ${count} job titles in English that are most relevant for hiring, and surrounding fields.\n
  Respond only with the names of the job titles.\n
  Each job title should be known for its relevance in the tech and startup ecosystem.\n
  List the job titles on separate lines without numbers or dashes at the beginning.\n
  Do not include numbers or symbols.\n
  Here are the job titles:\n
  `;
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: 'You are an assistant specialized in web writing and SEO' },
        { role: 'user', content: prompt }
    ],
    max_tokens: 3000,
  });
  return response.choices[0].message.content.trim().split('\n').filter(job => job);
}

// Fonction principale pour générer et enregistrer la liste des métiers
async function main() {
    const occupationsPath = path.join(__dirname, 'occupations.json');
    let resultats = { jobs: [] };

    // Lire le fichier occupations.json s'il existe
    if (fs.existsSync(occupationsPath)) {
        const data = fs.readFileSync(occupationsPath, 'utf8');
        resultats = JSON.parse(data);
    }

    // Supprimer les doublons
    const uniqueJobs = Array.from(new Set(resultats.jobs.map(j => j.job)))
        .map(job => ({ job }));
    resultats.jobs = uniqueJobs;

    const existingJobs = resultats.jobs.map(j => j.job);
    const jobsNeeded = 100;

    if (jobsNeeded > 0) {
        console.log(`Generating ${jobsNeeded} more job titles relevant finance, investment and surrounding fields...`);
        const newJobs = await generateOccupations(jobsNeeded);
        newJobs.forEach(job => {
            if (!existingJobs.includes(job) && /^[a-zA-Z\s]+$/.test(job)) {
                resultats.jobs.push({ job });
            }
        });

        // Écrire les résultats dans le fichier occupations.json
        fs.writeFileSync(occupationsPath, JSON.stringify(resultats, null, 2));
        console.log('Results written to occupations.json');
    } else {
        console.log('The list already contains 100 job titles.');
    }
}

main();