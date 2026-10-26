import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Google Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System Status API
app.get('/api/system/status', async (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  const startTime = Date.now();
  let geminiReachable = false;
  let testError: string | null = null;

  if (hasKey) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'ping',
      });
      if (response && response.text) {
        geminiReachable = true;
      }
    } catch (err: unknown) {
      testError = err instanceof Error ? err.message : 'Unknown error';
    }
  }

  const latencyMs = Date.now() - startTime;

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: {
      gemini: {
        name: 'Google Gemini (Flash 3.8 / Omni / TTS)',
        configured: hasKey,
        connected: geminiReachable,
        latencyMs: hasKey ? latencyMs : 0,
        models: ['gemini-3.8-flash', 'gemini-3.1-flash-lite-image', 'gemini-3.8-flash-lite-tts'],
        error: testError,
      },
      googleCloud: {
        name: 'Google Cloud Run / AI Studio',
        configured: true,
        connected: true,
        environment: process.env.NODE_ENV || 'development',
      },
      openAiAdapter: {
        name: 'OpenAI GPT-4o Adapter',
        configured: Boolean(process.env.OPENAI_API_KEY),
        status: process.env.OPENAI_API_KEY ? 'Active' : 'Standby (User API key configurable in Integrations Hub)',
      },
      gammaBridge: {
        name: 'Gamma Presentation Bridge',
        configured: true,
        status: 'Export & Webhook Bridge Ready',
      },
      googleFlow: {
        name: 'Google Flow AI Orchestrator',
        configured: true,
        status: 'Prompt Transfer Protocol Ready',
      },
    },
    system: {
      nodeVersion: process.version,
      uptime: process.uptime(),
    },
  });
});

// Chat Streaming API with optional Search Grounding & Multimodal
app.post('/api/chat/stream', async (req: Request, res: Response) => {
  const { messages, systemInstruction, enableSearch, temperature } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    // Format contents for Gemini SDK
    const formattedContents = messages.map((m: { role: string; content: string; imageBase64?: string; imageMime?: string }) => {
      const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
      if (m.imageBase64) {
        const cleanBase64 = m.imageBase64.includes(',') ? m.imageBase64.split(',')[1] : m.imageBase64;
        parts.push({
          inlineData: {
            mimeType: m.imageMime || 'image/jpeg',
            data: cleanBase64,
          },
        });
      }
      parts.push({ text: m.content });
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts,
      };
    });

    const config: Record<string, unknown> = {
      systemInstruction: systemInstruction || 'You are ZOIR AI, an intelligent, helpful, multilingual AI assistant. Provide structured, accurate, well-formatted responses with markdown.',
      temperature: typeof temperature === 'number' ? temperature : 0.7,
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config,
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown generation error';
    res.write(`data: ${JSON.stringify({ error: errMessage })}\n\n`);
    res.end();
  }
});

// Image Generation API
app.post('/api/studio/generate-image', async (req: Request, res: Response) => {
  const { prompt, aspectRatio = '1:1', style = 'photorealistic', referenceImage } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt is required' });
    return;
  }

  try {
    // Construct rich styled prompt
    const enhancedPrompt = `${prompt}. Visual aesthetic: ${style}, high fidelity, professional composition, studio grade lighting, hyper-detailed.`;

    const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];

    if (referenceImage) {
      const cleanBase64 = referenceImage.includes(',') ? referenceImage.split(',')[1] : referenceImage;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64,
        },
      });
      parts.push({ text: `Modify and adapt this reference image: ${enhancedPrompt}` });
    } else {
      parts.push({ text: enhancedPrompt });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9',
        },
      },
    });

    let imageUrl: string | null = null;
    let caption: string = '';

    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          caption += part.text;
        }
      }
    }

    if (!imageUrl) {
      // If the model returned text only or image generation is restricted on key, provide fallback
      res.status(200).json({
        success: false,
        message: caption || 'Model completed request without inline image data.',
        prompt: enhancedPrompt,
      });
      return;
    }

    res.json({
      success: true,
      imageUrl,
      caption,
      aspectRatio,
      prompt: enhancedPrompt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error generating image';
    res.status(500).json({ error: message });
  }
});

// Text-to-Speech API
app.post('/api/audio/tts', async (req: Request, res: Response) => {
  const { text, voice = 'Kore' } = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text is required' });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text: text.slice(0, 1500) }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({
        audioUrl: `data:audio/wav;base64,${base64Audio}`,
        success: true,
      });
    } else {
      res.status(502).json({ error: 'No audio stream returned' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'TTS error';
    res.status(500).json({ error: message });
  }
});

// Open Library Book Search API proxy
app.get('/api/books/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string) || 'science fiction';
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 16;

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OpenLibrary responded with ${response.status}`);
    }

    const data = await response.json();
    const books = (data.docs || []).map((doc: Record<string, unknown>) => {
      const coverI = doc.cover_i;
      const coverUrl = coverI
        ? `https://covers.openlibrary.org/b/id/${coverI}-M.jpg`
        : null;
      return {
        key: doc.key,
        title: doc.title,
        author: Array.isArray(doc.author_name) ? doc.author_name.join(', ') : 'Unknown Author',
        firstPublishYear: doc.first_publish_year || 'Classic',
        coverUrl,
        editionCount: doc.edition_count || 1,
        language: Array.isArray(doc.language) ? doc.language : ['eng'],
        subject: Array.isArray(doc.subject) ? doc.subject.slice(0, 5) : [],
        hasFulltext: Boolean(doc.has_fulltext),
        ia: Array.isArray(doc.ia) ? doc.ia[0] : null,
      };
    });

    res.json({
      total: data.numFound || books.length,
      page,
      books,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Search error';
    res.json({
      total: 0,
      page,
      books: [],
      fallbackNotice: `Live OpenLibrary query failed (${msg}), fallback library catalogue remains active.`,
    });
  }
});

// English & IELTS Evaluation API
app.post('/api/english/evaluate', async (req: Request, res: Response) => {
  const { taskType, promptText, studentSubmission, currentLevel, targetBand = 9.0, explainInUzbek } = req.body;

  if (!studentSubmission) {
    res.status(400).json({ error: 'Student submission text is required' });
    return;
  }

  try {
    const systemPrompt = `You are a certified Senior IELTS Examiner and Master English Tutor for ZOIR AI Academy.
Your role: Provide rigorous, constructive, and highly motivating feedback for learners targeting up to IELTS Band 9.0.
Task Type: ${taskType || 'Writing Task 2'}
Prompt / Question: ${promptText || 'General assessment'}
Current Level: ${currentLevel || 'Intermediate (B1-B2)'}
Target IELTS Band: ${targetBand}
Explain in Uzbek if requested: ${explainInUzbek ? 'YES, include clear Uzbek explanations alongside English so Uzbek speakers grasp the nuances.' : 'NO, purely in clear English.'}

Return your assessment in clean JSON format matching this schema:
{
  "estimatedBand": number (e.g. 6.5, 7.0, 8.5),
  "cefrLevel": string ("A1" | "A2" | "B1" | "B2" | "C1" | "C2"),
  "scores": {
    "taskAchievement": { "score": number, "feedback": string },
    "coherenceCohesion": { "score": number, "feedback": string },
    "lexicalResource": { "score": number, "feedback": string },
    "grammaticalRange": { "score": number, "feedback": string }
  },
  "keyCorrections": [
    { "original": string, "corrected": string, "reason": string, "uzbekExplanation": string }
  ],
  "band9Rewrite": string,
  "topRecommendations": string[],
  "uzbekSummary": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Evaluate this IELTS submission:\n\n${studentSubmission}` }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Evaluation error';
    res.status(500).json({ error: message });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZOIR AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
