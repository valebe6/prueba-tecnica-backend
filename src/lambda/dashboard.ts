export interface DashboardData {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
}

interface LambdaEvent {
  notes: Array<{
    status: string;
  }>;
}

export async function handler(event: LambdaEvent): Promise<DashboardData> {
  const notes = event.notes ?? [];

  const total = notes.length;

  const pending = notes.filter((note) => note.status === 'PENDIENTE').length;

  const inProgress = notes.filter((note) => note.status === 'EN_CURSO').length;

  const done = notes.filter((note) => note.status === 'HECHO').length;

  return {
    total,
    pending,
    inProgress,
    done,
  };
}
