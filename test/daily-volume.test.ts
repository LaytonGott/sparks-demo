import assert from 'node:assert/strict';
import test from 'node:test';
import { dailyVolume } from '../src/daily-volume.ts';

test('the digest reports each occupied day in chronological order', () => {
  const rows = [
    '2026-09-02T00:00:00.000Z',
    '2026-09-01T23:59:59.999Z',
    '2026-09-02T16:30:00.000Z',
  ].map(createdAt => ({ createdAt }));
  assert.deepEqual(dailyVolume(rows), [
    { day: '2026-09-01', count: 1 },
    { day: '2026-09-02', count: 2 },
  ]);
});

test('empty snapshots produce an empty digest', () => {
  assert.deepEqual(dailyVolume([]), []);
});
