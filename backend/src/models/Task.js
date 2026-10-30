import mongoose from 'mongoose';

export const STATUSES = ['Pending', 'In Progress', 'Completed'];
export const PRIORITIES = ['Low', 'Medium', 'High'];

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title must be at most 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must be at most 1000 characters'],
      default: '',
    },
    status: { type: String, enum: { values: STATUSES, message: 'Invalid status' }, default: 'Pending' },
    priority: { type: String, enum: { values: PRIORITIES, message: 'Invalid priority' }, default: 'Medium' },
    dueDate: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, createdAt: -1 });

// Keep completedAt in sync with status
taskSchema.pre('save', function () {
  if (this.isModified('status')) {
    this.completedAt = this.status === 'Completed' ? new Date() : null;
  }
});

export default mongoose.model('Task', taskSchema);
