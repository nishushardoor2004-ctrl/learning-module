const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseWithProgress
} = require('../controllers/courseController');
const { authMiddleware, requireRole } = require('../middleware/auth');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.get('/:id/progress', authMiddleware, getCourseWithProgress);
router.post('/', authMiddleware, requireRole('instructor', 'admin'), createCourse);
router.put('/:id', authMiddleware, requireRole('instructor', 'admin'), updateCourse);
router.delete('/:id', authMiddleware, requireRole('instructor', 'admin'), deleteCourse);

module.exports = router;
