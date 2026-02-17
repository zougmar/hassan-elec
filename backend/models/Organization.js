import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: true,
    trim: true
  },
  org_address: {
    type: String,
    default: ''
  },
  org_email: {
    type: String,
    default: '',
    lowercase: true,
    trim: true
  },
  org_contact: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

organizationSchema.virtual('departments', {
  ref: 'Department',
  localField: '_id',
  foreignField: 'organization'
});

export default mongoose.model('Organization', organizationSchema);
