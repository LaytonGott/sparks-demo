import assert from 'node:assert/strict';
import test from 'node:test';
import { startApi } from './fixture.ts';

for (const completed of [true, false]) {
  test(`GET /tasks?completed=${completed} returns matching tasks`, async t => {
    const api = await startApi(t);
    const open = await (await api('/tasks', 'POST', { title: 'Write meeting notes' })).json();
    const filed = await (await api('/tasks', 'POST', { title: 'File agenda' })).json();
    const done = await (await api(`/tasks/${filed.id}`, 'PATCH', { completed: true })).json();

    const response = await api(`/tasks?completed=${completed}`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { tasks: [completed ? done : open] });
  });
}

test('GET /tasks rejects unknown completion values', async t => {
  const api = await startApi(t);
  assert.equal((await api('/tasks?completed=all')).status, 400);
});
