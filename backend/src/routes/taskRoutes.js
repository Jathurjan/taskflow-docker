import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getTasks,
  getStats,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { STATUSES, PRIORITIES } from '../models/Task.js';

const router = Router();

router.use(protect); // every task route requires a valid JWT

const idRule = param('id').isMongoId().withMessage('Invalid task id');

const taskRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 120 }).withMessage('Title must be at most 120 characters'),
  body('description').optional({ values: 'null' }).trim().isLength({ max: 1000 }).withMessage('Description must be at most 1000 characters'),
  body('status').optional().isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('priority').optional().isIn(PRIORITIES).withMessage(`Priority must be one of: ${PRIORITIES.join(', ')}`),
  body('dueDate').optional({ values: 'falsy' }).isISO8601().withMessage('Due date must be a valid date'),
];

const statusRule = [
  body('status').isIn(STATUSES).withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
];

router.route('/').get(getTasks).post(taskRules, validate, createTask);
router.get('/stats', getStats); // must stay above '/:id'
router
  .route('/:id')
  .get(idRule, validate, getTask)
  .put(idRule, taskRules, validate, updateTask)
  .delete(idRule, validate, deleteTask);
router.patch('/:id/status', idRule, statusRule, validate, updateTaskStatus);

export default router;
