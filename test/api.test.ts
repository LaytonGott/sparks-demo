import assert from 'node:assert/strict';
import test from 'node:test';
import { startApi } from './fixture.ts';

test('the task list starts empty', async t => {
  const api = await startApi(t);
  const response = await api('/tasks');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { tasks: [] });
});

test('a task can be created, completed and reopened', async t => {
  const api = await startApi(t);
  const response = await api('/tasks', 'POST', { title: '  Book meeting room  ' });
  assert.equal(response.status, 201);
  const task = await response.json();
  assert.equal(task.title, 'Book meeting room');
  assert.equal(task.completed, false);
  assert.ok(task.id);
  assert.ok(Number.isFinite(Date.parse(task.createdAt)));

  for (const completed of [true, false]) {
    const updated = await api(`/tasks/${task.id}`, 'PATCH', { completed });
    assert.equal(updated.status, 200);
    assert.deepEqual(await updated.json(), { ...task, completed });
    assert.deepEqual(await (await api('/tasks')).json(), { tasks: [{ ...task, completed }] });
  }
});

test('invalid titles return a client error and leave the list empty', async t => {
  const api = await startApi(t);
  for (const title of ['   ', 'a'.repeat(201), 123, null]) {
    assert.equal((await api('/tasks', 'POST', { title })).status, 400);
  }
  assert.deepEqual(await (await api('/tasks')).json(), { tasks: [] });
});

test('completion updates validate the value and task ID', async t => {
  const api = await startApi(t);
  assert.equal((await api('/tasks/missing', 'PATCH', { completed: true })).status, 404);
  assert.equal((await api('/tasks/missing', 'PATCH', { completed: 'true' })).status, 400);
});
