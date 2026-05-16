import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getJson } from 'serpapi';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Serp API endpoint
  app.get('/api/search', async (req, res) => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    try {
      const apiKey = process.env.SERPAPI_API_KEY;
      if (!apiKey) {
        throw new Error('SERPAPI_API_KEY environment variable is required');
      }

      const results = await getJson({
        engine: "google",
        q: q,
        api_key: apiKey,
      });

      res.json(results);
    } catch (error: any) {
      console.error('SerpAPI Error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch search results' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
