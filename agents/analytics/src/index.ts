import http from 'http';
import { prisma, createWorker } from '@goodnews/shared';

interface AnalyticsJob {
  articleId: string;
}

interface TrackRequest {
  articleId: string;
  event: 'view' | 'share' | 'like' | 'click';
  platform?: string;
}

const ANALYTICS_PORT = parseInt(process.env.ANALYTICS_PORT || '3002', 10);

const worker = createWorker<AnalyticsJob>('analytics', async (job) => {
  const { articleId } = job.data;

  await prisma.articleAnalytics.upsert({
    where: { articleId },
    update: {},
    create: {
      articleId,
      views: 0,
      shares: 0,
      likes: 0,
      clickThrough: 0,
    },
  });

  console.log(`[Analytics] Initialized analytics for article ${articleId}`);
});

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/track') {
    let body = '';

    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
      if (body.length > 4096) {
        res.writeHead(413);
        res.end('Payload too large');
      }
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body) as TrackRequest;

        if (!data.articleId || !data.event) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing articleId or event' }));
          return;
        }

        const validEvents = ['view', 'share', 'like', 'click'];
        if (!validEvents.includes(data.event)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid event type' }));
          return;
        }

        const incrementField: Record<string, object> = {
          view: { views: { increment: 1 } },
          share: { shares: { increment: 1 } },
          like: { likes: { increment: 1 } },
          click: { clickThrough: { increment: 1 } },
        };

        await prisma.articleAnalytics.upsert({
          where: { articleId: data.articleId },
          update: incrementField[data.event],
          create: {
            articleId: data.articleId,
            views: data.event === 'view' ? 1 : 0,
            shares: data.event === 'share' ? 1 : 0,
            likes: data.event === 'like' ? 1 : 0,
            clickThrough: data.event === 'click' ? 1 : 0,
          },
        });

        console.log(
          `[Analytics] Tracked ${data.event} for article ${data.articleId}`
        );

        res.writeHead(204);
        res.end();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[Analytics] Error processing track request:', msg);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });

    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'analytics' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(ANALYTICS_PORT, () => {
  console.log(`[Analytics] HTTP server listening on port ${ANALYTICS_PORT}`);
});

server.on('error', (err) => {
  console.error('[Analytics] Server error:', err.message);
});

console.log('[Analytics] Worker started');
