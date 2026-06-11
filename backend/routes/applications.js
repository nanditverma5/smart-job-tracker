const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getApplications, addApplication,
  updateApplication, deleteApplication, getStats
} = require('../controllers/applicationController');

router.get('/', auth, getApplications);
router.post('/', auth, addApplication);
router.put('/:id', auth, updateApplication);
router.delete('/:id', auth, deleteApplication);
router.get('/stats', auth, getStats);

module.exports = router;