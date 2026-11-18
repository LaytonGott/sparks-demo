import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskStore } from '../src/tasks.ts';

test('tasks created in the same millisecond are listed alphabetically', () => {
  let timestamp = 0;
  const store = new TaskStore(() => new Date(timestamp));
  const room = store.create('Book room');
  const agenda = store.create('Arrange agenda');
  timestamp += 1;
  const notes = store.create('Write notes');

  assert.deepEqual(store.list(), [notes, agenda, room]);
});
