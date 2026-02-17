import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    fr: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    fr: { type: String, required: true },
    ar: { type: String, required: true }
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    default: 'general'
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);
