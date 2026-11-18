import { pathToFileURL } from 'node:url';
import { text } from 'node:stream/consumers';
import type { Task } from './tasks.ts';

export function exportMonth(tasks: Task[], month: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Expected a month in YYYY-MM format');
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  const from = start.getTime();
  const until = end.getTime();
  return tasks.filter(task => {
    const created = Date.parse(task.createdAt);
    return created >= from && created < until;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { tasks } = JSON.parse(await text(process.stdin));
  console.log(JSON.stringify({ tasks: exportMonth(tasks, process.argv[2] ?? '') }));
}
