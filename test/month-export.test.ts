import assert from 'node:assert/strict';
import test from 'node:test';
import { exportMonth } from '../src/month-export.ts';

test('a December export selects tasks from that UTC calendar month', () => {
  const tasks = [
    '2025-11-30T23:59:59.999Z',
    '2025-12-01T00:00:00.000Z',
    '2025-12-31T23:59:59.999Z',
    '2026-01-01T00:00:00.000Z',
  ].map((createdAt, i) => ({ id: String(i), title: 'Send invoice', completed: false, createdAt }));
  assert.deepEqual(exportMonth(tasks, '2025-12'), [tasks[1], tasks[2]]);
});

test('invalid month numbers are rejected', () => {
  assert.throws(() => exportMonth([], '2026-13'), /YYYY-MM/);
});
