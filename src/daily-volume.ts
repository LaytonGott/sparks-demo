import { pathToFileURL } from 'node:url';
import { text } from 'node:stream/consumers';
import type { Task } from './tasks.ts';

export function dailyVolume(tasks: Pick<Task, 'createdAt'>[]) {
  const counts = new Map<string, number>();
  for (const task of tasks) {
    const day = task.createdAt.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([day, count]) => ({ day, count }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const snapshot: unknown = JSON.parse(await text(process.stdin));
  const tasks = (snapshot as { tasks?: unknown } | null)?.tasks;
  if (!Array.isArray(tasks) || !tasks.every(task => typeof task?.createdAt === 'string')) {
    throw new Error('Expected {"tasks":[{"createdAt":"<ISO timestamp>"}]} on stdin');
  }
  console.log(JSON.stringify(dailyVolume(tasks)));
}
