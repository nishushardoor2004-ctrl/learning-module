const express = require('express');
const router = express.Router();
const {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public routes
router.get('/:id', getLessonById);

// Protected routes (instructor/admin only)
router.post('/', authMiddleware, requireRole('instructor', 'admin'), createLesson);
router.put('/:id', authMiddleware, requireRole('instructor', 'admin'), updateLesson);
router.delete('/:id', authMiddleware, requireRole('instructor', 'admin'), deleteLesson);

module.exports = router;
