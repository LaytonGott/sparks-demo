import { randomUUID } from 'node:crypto';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export class TaskStore {
  private tasks = new Map<string, Task>();
  private now: () => Date;

  constructor(now = () => new Date()) {
    this.now = now;
  }

  get(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  create(title: string): Task {
    const task = { id: randomUUID(), title, completed: false, createdAt: this.now().toISOString() };
    this.tasks.set(task.id, task);
    return task;
  }

  list(): Task[] {
    return [...this.tasks.values()].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.createdAt.localeCompare(a.createdAt) || a.title.localeCompare(b.title, 'en');
    });
  }

  setCompleted(id: string, completed: boolean): Task | undefined {
    const task = this.tasks.get(id);
    if (task) task.completed = completed;
    return task;
  }
}
