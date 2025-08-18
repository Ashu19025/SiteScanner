import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import * as cheerio from 'cheerio';
import https from 'https';
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//Extract brand and description
export const scrapeWebsite = async (url) => {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const { data } = await axios.get(url, { httpsAgent: agent, timeout: 10000 });
    const $ = cheerio.load(data);

    const brand = $('meta[property="og:site_name"]').attr('content') || $('title').text().trim() || 'Unknown Brand';
    let description = $('meta[name="description"]').attr('content')?.trim() || '';

    if (!description) {
      console.log('🚀 Generating AI description...');
      const response = await client.generateText({
        model: 'gemini-2.5',
        prompt: `Write a short, human-friendly description for this website: ${url}`,
        maxOutputTokens: 100,
      });
      description = response?.candidates?.[0]?.content?.trim() || 'No description available';
      console.log('💡 AI generated description:', description);
    }

    return { brand, description };
  } catch (error) {
    console.error('Scraping/OpenAI error:', error.message);
    return { brand: 'Unknown Brand', description: 'No description available' };
  }
};
