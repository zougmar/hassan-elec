import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);
