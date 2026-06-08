const STATUS_LABELS = {
  todo: 'To do',
  in_progress: 'In progress',
  done: 'Done',
};

export default function TaskList({ tasks, onEdit, onDelete, isAdmin }) {
  if (tasks.length === 0) {
    return <p className="muted empty-state">No tasks yet. Create your first one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <li
          key={task.id}
          className="task-card animate-slide-up"
          style={{ animationDelay: `${index * 0.06}s` }}
        >
          <div className="task-card-header">
            <h3>{task.title}</h3>
            <span className={`status-badge status-${task.status}`}>
              {STATUS_LABELS[task.status] || task.status}
            </span>
          </div>
          <p className="task-description">{task.description}</p>
          {isAdmin && task.userId && (
            <p className="task-meta">Owner: {task.userId.slice(0, 8)}…</p>
          )}
          <div className="task-actions">
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(task)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
