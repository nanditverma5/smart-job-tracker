const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const note = await Note.findOne({ applicationId: req.params.id });
    res.json(note || { applicationId: req.params.id, notes: [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addNote = async (req, res) => {
  const { text } = req.body;
  try {
    let note = await Note.findOne({ applicationId: req.params.id });
    if (!note) {
      note = new Note({ applicationId: req.params.id, notes: [] });
    }
    note.notes.push({ text });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  const { id, noteId } = req.params;
  try {
    const note = await Note.findOne({ applicationId: id });
    if (!note) return res.status(404).json({ message: 'Not found' });
    note.notes = note.notes.filter(n => n._id.toString() !== noteId);
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};