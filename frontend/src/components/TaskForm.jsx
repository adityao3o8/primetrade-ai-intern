import { useState } from 'react';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

const emptyForm = { title: '', description: '', status: 'todo' };

export default function TaskForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(initial || emptyForm);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(form);
      if (!initial) setForm(emptyForm);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          maxLength={200}
          placeholder="Task title"
        />
      </div>
      <div className="form-row">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          maxLength={5000}
          placeholder="What needs to be done?"
        />
      </div>
      <div className="form-row">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={form.status} onChange={handleChange}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
