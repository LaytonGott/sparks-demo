import assert from 'node:assert/strict';
import test from 'node:test';
import { startApi } from './fixture.ts';

test('an empty board has zero completion', async t => {
  const api = await startApi(t);
  const response = await api('/stats');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { total: 0, completed: 0, percentComplete: 0 });
});

test('the overview includes the whole-number completion percentage', async t => {
  const api = await startApi(t);
  for (const title of ['Draft', 'Review', 'Publish']) {
    const task = await (await api('/tasks', 'POST', { title })).json();
    if (title === 'Draft') await api(`/tasks/${task.id}`, 'PATCH', { completed: true });
  }
  assert.deepEqual(await (await api('/stats')).json(), { total: 3, completed: 1, percentComplete: 33 });
});
