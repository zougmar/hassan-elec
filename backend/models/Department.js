import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  dept_name: {
    type: String,
    required: true,
    trim: true
  },
  dept_contact: {
    type: String,
    default: ''
  },
  dept_email: {
    type: String,
    default: '',
    lowercase: true,
    trim: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

departmentSchema.virtual('employees', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'department'
});

departmentSchema.virtual('managers', {
  ref: 'Manager',
  localField: '_id',
  foreignField: 'department'
});

export default mongoose.model('Department', departmentSchema);
