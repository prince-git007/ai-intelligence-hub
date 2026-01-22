const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    trim: true
  },
  originalContent: {
    type: String,
    required: true
  },
  aiSummary: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['New', 'Contacted'],
    default: 'New'
  },
  replies: [{
    replyText: {
      type: String,
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    },
    sentBy: {
      type: String,
      default: 'system'
    },
    status: {
      type: String,
      enum: ['queued', 'sent', 'failed'],
      default: 'queued'
    }
  }]
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;
