const { pgPool } = require('../config/db');
const Note = require('../models/Note');

exports.getApplications = async (req, res) => {
  try {
    const result = await pgPool.query(
      'SELECT * FROM applications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addApplication = async (req, res) => {
  const { company, role, status, applied_date } = req.body;
  try {
    const result = await pgPool.query(
      'INSERT INTO applications (user_id, company, role, status, applied_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, company, role, status || 'Applied', applied_date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateApplication = async (req, res) => {
  const { id } = req.params;
  const { company, role, status, applied_date } = req.body;
  try {
    const result = await pgPool.query(
      'UPDATE applications SET company=$1, role=$2, status=$3, applied_date=$4 WHERE id=$5 AND user_id=$6 RETURNING *',
      [company, role, status, applied_date, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Application not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  const { id } = req.params;
  try {
    await pgPool.query('DELETE FROM applications WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    await Note.findOneAndDelete({ applicationId: id });
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const result = await pgPool.query(
      'SELECT status, COUNT(*) as count FROM applications WHERE user_id=$1 GROUP BY status',
      [req.user.id]
    );
    const total = await pgPool.query(
      'SELECT COUNT(*) as count FROM applications WHERE user_id=$1',
      [req.user.id]
    );
    res.json({ stats: result.rows, total: total.rows[0].count });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};