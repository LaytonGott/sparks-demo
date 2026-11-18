import assert from 'node:assert/strict';
import test from 'node:test';
import { startApi } from './fixture.ts';

test('task detail reflects the latest state', async t => {
  const api = await startApi(t);
  const task = await (await api('/tasks', 'POST', { title: 'Print agenda' })).json();
  await api(`/tasks/${task.id}`, 'PATCH', { completed: true });
  const response = await api(`/tasks/${task.id}`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ...task, completed: true });
});

test('unknown task IDs return 404', async t => {
  const api = await startApi(t);
  assert.equal((await api('/tasks/unknown')).status, 404);
});
