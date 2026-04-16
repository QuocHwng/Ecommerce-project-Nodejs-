const express = require('express');
const router = express.Router();
const { createExportNote, getExportNotes, getExportNoteById } = require('../controllers/exportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createExportNote).get(protect, admin, getExportNotes);

router.route('/:id').get(protect, admin, getExportNoteById);
module.exports = router;