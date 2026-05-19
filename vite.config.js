import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const highScoreFile = join(projectRoot, 'data', 'highscore.txt');

function parseScore(value) {
  const score = Number.parseInt(value, 10);

  if (!Number.isFinite(score) || score < 0) {
    return 0;
  }

  return score;
}

async function writeHighScore(score) {
  await mkdir(dirname(highScoreFile), { recursive: true });
  await writeFile(highScoreFile, `${score}\n`, 'utf8');
}

async function readHighScore() {
  try {
    const contents = await readFile(highScoreFile, 'utf8');
    return parseScore(contents.trim());
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeHighScore(0);
      return 0;
    }

    throw error;
  }
}

async function readJsonBody(request) {
  let body = '';

  for await (const chunk of request) {
    body += chunk;
  }

  return body ? JSON.parse(body) : {};
}

function sendJson(response, statusCode, data) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(data));
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'highscore-text-file-api',
      configureServer(server) {
        server.middlewares.use('/api/highscore', async (request, response, next) => {
          try {
            if (request.method === 'GET') {
              sendJson(response, 200, { highScore: await readHighScore() });
              return;
            }

            if (request.method === 'POST') {
              const body = await readJsonBody(request);
              const currentHighScore = await readHighScore();
              const nextHighScore = Math.max(currentHighScore, parseScore(body.score));

              await writeHighScore(nextHighScore);
              sendJson(response, 200, { highScore: nextHighScore });
              return;
            }

            sendJson(response, 405, { error: 'Method not allowed' });
          } catch (error) {
            next(error);
          }
        });
      },
    },
  ],
});
