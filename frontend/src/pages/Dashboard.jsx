import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksApi } from '../api/client';
import PageShell from '../components/PageShell';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tasksApi.list();
      setTasks(data.tasks);
    } catch (err) {
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(form) {
    try {
      const data = await tasksApi.create(form);
      setTasks((prev) => [data.task, ...prev]);
      showToast('Task created');
    } catch (err) {
      showToast(err.message || 'Failed to create task', 'error');
      throw err;
    }
  }

  async function handleUpdate(form) {
    if (!editingTask) return;
    try {
      const data = await tasksApi.update(editingTask.id, form);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? data.task : t)));
      setEditingTask(null);
      showToast('Task updated');
    } catch (err) {
      showToast(err.message || 'Failed to update task', 'error');
      throw err;
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    try {
      await tasksApi.remove(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      if (editingTask?.id === task.id) setEditingTask(null);
      showToast('Task deleted');
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  }

  async function handleLogout() {
    try {
      await logout();
      showToast('Logged out');
      navigate('/login', { replace: true });
    } catch (err) {
      showToast(err.message || 'Logout failed', 'error');
    }
  }

  return (
    <PageShell className="dashboard">
      <header className="dashboard-header glass-card">
        <div>
          <h1>Tasks</h1>
          <p className="muted">
            {user.name} · {user.email}
            {user.role === 'admin' && <span className="role-badge">Admin</span>}
          </p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className="dashboard-section glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h2>{editingTask ? 'Edit task' : 'New task'}</h2>
        <TaskForm
          key={editingTask?.id || 'new'}
          initial={
            editingTask
              ? {
                  title: editingTask.title,
                  description: editingTask.description,
                  status: editingTask.status,
                }
              : undefined
          }
          onSubmit={editingTask ? handleUpdate : handleCreate}
          onCancel={editingTask ? () => setEditingTask(null) : undefined}
          submitLabel={editingTask ? 'Update task' : 'Create task'}
        />
      </section>

      <section className="dashboard-section glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2>Your tasks</h2>
        {loading ? (
          <div className="loading-dots">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            isAdmin={user.role === 'admin'}
          />
        )}
      </section>
    </PageShell>
  );
}
