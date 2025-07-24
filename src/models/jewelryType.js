const mongoose = require('mongoose');

const jewelryTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Jewelry type is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Type name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
jewelryTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better search performance
jewelryTypeSchema.index({ type: 'text', description: 'text' });
jewelryTypeSchema.index({ isActive: 1 });

module.exports = mongoose.model('JewelryType', jewelryTypeSchema);