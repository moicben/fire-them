import fs from 'fs';

// Read the JSON file
const data = JSON.parse(fs.readFileSync('C:/Users/bendo/Desktop/Documents/ProgramaticSEO/fire-them/occupations.json', 'utf8'));

// Filter out jobs with "II" or "III" in their name and remove duplicates
const uniqueJobs = Array.from(new Set(data.jobs
    .filter(job => !job.job.includes('II') && !job.job.includes('III'))
    .map(job => job.job)))
    .map(job => ({ job }));

// Write the cleaned data back to the JSON file
fs.writeFileSync('C:/Users/bendo/Desktop/Documents/ProgramaticSEO/fire-them/occupations.json', JSON.stringify({ jobs: uniqueJobs }, null, 2));

console.log('Filtered jobs and removed duplicates successfully.');