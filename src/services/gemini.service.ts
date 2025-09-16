import { Injectable, signal } from '@angular/core';
import { GoogleGenAI, Type } from '@google/genai';
import { Article } from '../models/article.model';

export type GeminiState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  readonly state = signal<GeminiState>('idle');
  readonly response = signal<string>('');

  readonly reportState = signal<GeminiState>('idle');
  readonly reportResponse = signal<string>('');
  
  constructor() {
    try {
        if (process.env.API_KEY) {
            this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        } else {
            console.error('API_KEY environment variable not found.');
            this.state.set('error');
            this.response.set('API_KEY is not configured.');
            this.reportState.set('error');
            this.reportResponse.set('API_KEY is not configured.');
        }
    } catch (error) {
        console.error('Error initializing GoogleGenAI:', error);
    }
  }

  async generateArticleImage(prompt: string): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini AI is not initialized.');
    }
    try {
      const result = await this.ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `A professional, high-tech, abstract background for a cybersecurity blog article titled: "${prompt}". Dark theme, with accents of cyan and purple.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });
      const base64ImageBytes = result.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
      console.error('Error generating image:', error);
      return `https://picsum.photos/seed/${prompt.replace(/\s/g, '_')}/600/400`;
    }
  }

  async generateInContentImage(prompt: string): Promise<string> {
    if (!this.ai) {
      throw new Error('Gemini AI is not initialized.');
    }
    try {
      const result = await this.ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: `A high-quality, realistic image for a cybersecurity blog article. The image should depict: "${prompt}". Digital art style, dark and moody, with highlights of cyan or neon.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '4:3',
        },
      });
      const base64ImageBytes = result.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
      console.error('Error generating in-content image:', error);
      // Return a placeholder or re-throw to be handled by the caller
      throw error;
    }
  }

  async generateInitialArticles(): Promise<Omit<Article, 'id' | 'imageUrl' | 'author' | 'date'>[]> {
    if (!this.ai) {
      throw new Error('Gemini AI is not initialized.');
    }

    const prompt = `
      Generate 6 professional blog articles for a cybersecurity blog named "DarkShield". 
      The articles should cover a range of categories: 
      'Tech News', 'Ethical Hacking', 'AI Tools', 'Digital Library'. Each article must include a title, 
      a concise summary (2-3 sentences), and full content in markdown format (at least 300 words). 
      Ensure the content is technical, informative, and engaging for a cybersecurity audience. 
      Format the output as a JSON array of objects.
    `;
    
    try {
      const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['Tech News', 'Ethical Hacking', 'AI Tools', 'Digital Library'] },
                content: { type: Type.STRING, description: "Full article content in markdown format, at least 300 words." }
              },
              required: ["title", "summary", "category", "content"]
            }
          }
        }
      });
      const jsonStr = result.text.trim();
      const articles = JSON.parse(jsonStr);
      return articles;
    } catch(error) {
      console.error('Error generating initial articles:', error);
      return [];
    }
  }

  async generateContent(prompt: string): Promise<void> {
    if (!this.ai) {
      this.state.set('error');
      this.response.set('Gemini AI is not initialized. Check API key.');
      return;
    }

    this.state.set('loading');
    this.response.set('');

    try {
      const fullPrompt = `You are a cybersecurity expert assistant for the DarkShield blog. Provide a concise and informative answer to the following user question. Use markdown for formatting. Question: "${prompt}"`;
      
      const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      this.response.set(result.text);
      this.state.set('success');

    } catch (error) {
      console.error('Error generating content:', error);
      this.state.set('error');
      this.response.set('An error occurred while communicating with the AI. Please try again later.');
    }
  }

  async generateSecurityReport(): Promise<void> {
    if (!this.ai) {
      this.reportState.set('error');
      this.reportResponse.set('Gemini AI is not initialized. Check API key.');
      return;
    }

    this.reportState.set('loading');
    this.reportResponse.set('');

    try {
      const prompt = `
        As the AI core for DarkShield, generate a weekly security report.
        - Analyze fictional global threat vectors and recent (but plausible) vulnerabilities (e.g., CVE-2024-XXXXX).
        - Correlate this with fictional traffic patterns and user queries on the DarkShield blog.
        - Provide a concise summary and one actionable recommendation for the blog's content strategy.
        - Format the output as a simple text-based report.
      `;
      
      const result = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      this.reportResponse.set(result.text);
      this.reportState.set('success');

    } catch (error) {
      console.error('Error generating security report:', error);
      this.reportState.set('error');
      this.reportResponse.set('An error occurred while generating the report.');
    }
  }
}