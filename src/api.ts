import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { TaskStore } from './tasks.ts';

class InputError extends Error {}

async function readObject(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_384) throw new InputError('Request body exceeds 16 KiB');
    chunks.push(chunk);
  }
  let value: unknown;
  try {
    value = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new InputError('Expected a JSON object');
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new InputError('Expected a JSON object');
  }
  return value as Record<string, unknown>;
}

function json(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

export function createApi(store = new TaskStore()) {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? '/', 'http://localhost');
      if (url.pathname === '/tasks' && request.method === 'GET') {
        return json(response, 200, { tasks: store.list() });
      }

      if (url.pathname === '/tasks' && request.method === 'POST') {
        const { title } = await readObject(request);
        if (typeof title !== 'string' || !title.trim() || title.trim().length > 200) {
          throw new InputError('Title must contain 1 to 200 characters');
        }
        return json(response, 201, store.create(title.trim()));
      }

      if (request.method === 'GET' && url.pathname === '/stats') {
        const tasks = store.list();
        const completed = tasks.filter(task => task.completed).length;
        const percentComplete = tasks.length ? Math.round(completed / tasks.length) * 100 : 0;
        return json(response, 200, { total: tasks.length, completed, percentComplete });
      }

      const match = /^\/tasks\/([^/]+)$/.exec(url.pathname);
      if (match && request.method === 'PATCH') {
        const { completed } = await readObject(request);
        if (typeof completed !== 'boolean') throw new InputError('Expected a boolean for completed');
        const task = store.setCompleted(match[1], completed);
        if (task) return json(response, 200, task);
      }
      return json(response, 404, { error: 'Not found' });
    } catch (error) {
      if (error instanceof InputError) return json(response, 400, { error: error.message });
      console.error(error);
      return json(response, 500, { error: 'Internal server error' });
    }
  });
}
