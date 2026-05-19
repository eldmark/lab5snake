import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const projectRoot = dirname(fileURLToPath(import.meta.url));
const highScoreFile = join(projectRoot, 'data', 'highscore.txt');
const MAX_HIGH_SCORES = 10;

function parseScore(value) {
  const score = Number.parseInt(value, 10);

  if (!Number.isFinite(score) || score < 0) {
    return 0;
  }

  return score;
}

function sortHighScores(scores) {
  return scores
    .filter((score) => Number.isFinite(score) && score >= 0)
    .sort((firstScore, secondScore) => secondScore - firstScore)
    .slice(0, MAX_HIGH_SCORES);
}

function parseHighScores(contents) {
  return sortHighScores(
    contents
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter(Boolean)
      .map(parseScore),
  );
}

async function writeHighScores(scores) {
  await mkdir(dirname(highScoreFile), { recursive: true });
  await writeFile(highScoreFile, `${sortHighScores(scores).join('\n')}\n`, 'utf8');
}

async function readHighScores() {
  try {
    const contents = await readFile(highScoreFile, 'utf8');
    return parseHighScores(contents);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeHighScores([]);
      return [];
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
              const highScores = await readHighScores();
              sendJson(response, 200, { highScore: highScores[0] ?? 0, highScores });
              return;
            }

            if (request.method === 'POST') {
              const body = await readJsonBody(request);
              const currentHighScores = await readHighScores();
              const highScores = sortHighScores([...currentHighScores, parseScore(body.score)]);

              await writeHighScores(highScores);
              sendJson(response, 200, { highScore: highScores[0] ?? 0, highScores });
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
