const express = require('express');
const router = express.Router();
const {
  getSectionsByCourse,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public routes
router.get('/course/:courseId', getSectionsByCourse);

// Protected routes (instructor/admin only)
router.post('/', authMiddleware, requireRole('instructor', 'admin'), createSection);
router.put('/:id', authMiddleware, requireRole('instructor', 'admin'), updateSection);
router.delete('/:id', authMiddleware, requireRole('instructor', 'admin'), deleteSection);

module.exports = router;
