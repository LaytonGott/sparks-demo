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

  create(title: string): Task {
    const task = { id: randomUUID(), title, completed: false, createdAt: this.now().toISOString() };
    this.tasks.set(task.id, task);
    return task;
  }

  list(): Task[] {
    return [...this.tasks.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  setCompleted(id: string, completed: boolean): Task | undefined {
    const task = this.tasks.get(id);
    if (task) task.completed = completed;
    return task;
  }
}
