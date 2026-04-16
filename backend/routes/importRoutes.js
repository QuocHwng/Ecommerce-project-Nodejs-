// backend/routes/importRoutes.js
const express = require('express');
const router = express.Router();
const { createImportNote, getImportNotes,getImportNoteById } = require('../controllers/importController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createImportNote).get(protect, admin, getImportNotes);
router.route('/:id').get(protect, admin, getImportNoteById);
module.exports = router;