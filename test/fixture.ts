import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import type { TestContext } from 'node:test';
import { createApi } from '../src/api.ts';

export async function startApi(t: TestContext) {
  const server = createApi();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise<void>((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  }));
  const { port } = server.address() as AddressInfo;
  return (path: string, method = 'GET', body?: unknown) =>
    fetch(`http://127.0.0.1:${port}${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
}
