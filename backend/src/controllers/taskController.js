import Task from '../models/Task.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  title: { title: 1 },
};

const findOwnedTask = async (id, userId) => {
  const task = await Task.findOne({ _id: id, user: userId });
  if (!task) throw new ApiError(404, 'Task not found');
  return task;
};

// GET /api/tasks?search=&status=&priority=&sort=&page=&limit=
export const getTasks = asyncHandler(async (req, res) => {
  const { search, status, priority, sort = 'newest' } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 9, 1), 100);

  const filter = { user: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search && search.trim()) {
    const regex = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(SORTS[sort] || SORTS.newest)
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    success: true,
    tasks,
    pagination: { page, limit, total, pages: Math.max(Math.ceil(total / limit), 1) },
  });
});

// GET /api/tasks/stats
export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [grouped, overdue, recent] = await Promise.all([
    Task.aggregate([{ $match: { user: userId } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Task.countDocuments({ user: userId, status: { $ne: 'Completed' }, dueDate: { $lt: new Date() } }),
    Task.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
  ]);

  const counts = Object.fromEntries(grouped.map((g) => [g._id, g.count]));
  const pending = counts['Pending'] || 0;
  const inProgress = counts['In Progress'] || 0;
  const completed = counts['Completed'] || 0;

  res.json({
    success: true,
    stats: { total: pending + inProgress + completed, pending, inProgress, completed, overdue },
    recent,
  });
});

// GET /api/tasks/:id
export const getTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  res.json({ success: true, task });
});

// POST /api/tasks
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    status,
    priority,
    dueDate: dueDate || null,
  });
  res.status(201).json({ success: true, task });
});

// PUT /api/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  const { title, description, status, priority, dueDate } = req.body;

  task.title = title;
  if (description !== undefined) task.description = description;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate || null;

  await task.save();
  res.json({ success: true, task });
});

// PATCH /api/tasks/:id/status  (used for "mark as completed" and re-opening)
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  task.status = req.body.status;
  await task.save();
  res.json({ success: true, task });
});

// DELETE /api/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await findOwnedTask(req.params.id, req.user._id);
  await task.deleteOne();
  res.json({ success: true, message: 'Task deleted' });
});
