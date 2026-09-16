export async function handler(event) {
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
//# sourceMappingURL=dashboard.js.map