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

// Fonction pour générer la liste des villes pertinentes pour les startups et la tech
async function generateCities(count) {
  const prompt = `
  Generate a list of ${count} cities in the world that are most relevant for startups and tech.\n
  Respond only with the names of the cities.\n
  Each city should be known for its startup and tech ecosystem.\n
  List the cities on separate lines without numbers or dashes at the beginning.\n
  Do not include numbers or symbols.\n
  Here are the cities:\n
  `;
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
        { role: 'system', content: 'You are an assistant specialized in web writing and SEO' },
        { role: 'user', content: prompt }
    ],
    max_tokens: 3000,
  });
  return response.choices[0].message.content.trim().split('\n').filter(city => city);
}

// Fonction principale pour générer et enregistrer la liste des villes
async function main() {
    const locationPath = path.join(__dirname, 'locations.json');
    let resultats = { villes: [] };

    // Lire le fichier location.json s'il existe
    if (fs.existsSync(locationPath)) {
        const data = fs.readFileSync(locationPath, 'utf8');
        resultats = JSON.parse(data);
    }

    // Supprimer les doublons
    const uniqueCities = Array.from(new Set(resultats.villes.map(v => v.ville)))
        .map(ville => ({ ville }));
    resultats.villes = uniqueCities;

    const existingCities = resultats.villes.map(v => v.ville);
    const citiesNeeded = 300;

    if (citiesNeeded > 0) {
        console.log(`Generating ${citiesNeeded} more cities relevant for startups and tech...`);
        const newCities = await generateCities(citiesNeeded);
        newCities.forEach(city => {
            if (!existingCities.includes(city)) {
                resultats.villes.push({ ville: city });
            }
        });

        // Écrire les résultats dans le fichier location.json
        fs.writeFileSync(locationPath, JSON.stringify(resultats, null, 2));
        console.log('Results written to location.json');
    } else {
        console.log('The list already contains 1000 cities.');
    }
}

main();