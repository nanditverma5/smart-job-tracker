const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const noteController = require('../controllers/noteController');

router.get('/:id', auth, noteController.getNotes);
router.post('/:id', auth, noteController.addNote);
router.delete('/:id/:noteId', auth, noteController.deleteNote);

module.exports = router;