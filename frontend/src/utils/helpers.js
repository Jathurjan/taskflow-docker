export const STATUSES = ['Pending', 'In Progress', 'Completed'];
export const PRIORITIES = ['Low', 'Medium', 'High'];

// Due dates are stored as UTC midnight, so format in UTC to avoid off-by-one days
export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : 'No due date';

const pad = (n) => String(n).padStart(2, '0');

export const isOverdue = (task) => {
  if (!task.dueDate || task.status === 'Completed') return false;
  const now = new Date();
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return task.dueDate.slice(0, 10) < today;
};

export const toDateInput = (value) => (value ? value.slice(0, 10) : '');

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';
