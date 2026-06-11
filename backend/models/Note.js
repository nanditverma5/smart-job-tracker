const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  applicationId: { type: Number, required: true },
  notes: [{ text: String, createdAt: { type: Date, default: Date.now } }]
});

module.exports = mongoose.model('Note', noteSchema);