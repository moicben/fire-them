import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = ({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAI(configuration);

export async function generateContent(prompt) {
  try {
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 4000
    });
    let result = response.choices[0].message.content.trim();
    result = result.replace(/[`"'']/g, '');
    return result;

  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}