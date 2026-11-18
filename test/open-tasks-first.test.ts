import assert from 'node:assert/strict';
import test from 'node:test';
import { TaskStore } from '../src/tasks.ts';

test('open tasks lead the list with newest first within each group', () => {
  let tick = 0;
  const store = new TaskStore(() => new Date(tick++));
  const agenda = store.create('Draft agenda');
  const room = store.create('Book room');
  const slides = store.create('Prepare slides');
  const invites = store.create('Send invites');
  store.setCompleted(room.id, true);
  store.setCompleted(invites.id, true);

  assert.deepEqual(store.list(), [slides, agenda, invites, room]);
  store.setCompleted(invites.id, false);
  assert.deepEqual(store.list(), [invites, slides, agenda, room]);
});
