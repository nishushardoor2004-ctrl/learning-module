const express = require('express');
const router = express.Router();
const {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollmentStatus,
  unenrollFromCourse
} = require('../controllers/enrollmentController');
const { authMiddleware } = require('../middleware/auth');

// All enrollment routes require authentication
router.use(authMiddleware);

router.get('/my-courses', getMyEnrollments);
router.get('/:courseId/status', checkEnrollmentStatus);
router.post('/', enrollInCourse);
router.delete('/:courseId', unenrollFromCourse);

module.exports = router;
