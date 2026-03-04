const express = require('express');
const router = express.Router();
const {
  markLessonComplete,
  updateLastWatched,
  getCourseProgress,
  getAllProgress
} = require('../controllers/progressController');
const { authMiddleware } = require('../middleware/auth');

// All progress routes require authentication
router.use(authMiddleware);

router.get('/', getAllProgress);
router.get('/:courseId', getCourseProgress);
router.post('/complete', markLessonComplete);
router.post('/watch', updateLastWatched);

module.exports = router;
