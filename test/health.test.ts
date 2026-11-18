import assert from 'node:assert/strict';
import test from 'node:test';
import { startApi } from './fixture.ts';

test('the deployment probe can check liveness', async t => {
  const api = await startApi(t);
  const response = await api('/healthz');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
});
