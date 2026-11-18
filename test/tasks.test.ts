import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskStore } from '../src/tasks.ts';

test('the most recently created open task appears first', () => {
  let tick = 0;
  const store = new TaskStore(() => new Date(tick++));
  const first = store.create('Reserve a room');
  const second = store.create('Send invitations');
  assert.deepEqual(store.list(), [second, first]);
});
