import { pathToFileURL } from 'node:url';
import { text } from 'node:stream/consumers';
import type { Task } from './tasks.ts';

export function dailyVolume(tasks: Pick<Task, 'createdAt'>[]) {
  const dates = tasks.map(task => task.createdAt.slice(0, 10));
  const days = [...new Set(dates)].sort();
  return days.map(day => ({ day, count: dates.filter(date => date === day).length }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { tasks } = JSON.parse(await text(process.stdin));
  console.log(JSON.stringify(dailyVolume(tasks)));
}
