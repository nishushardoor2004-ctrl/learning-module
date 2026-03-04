const { Enrollment, Course, User, Section, Lesson } = require('../models');

// Enroll in a course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { userId, courseId }
    });

    if (existingEnrollment) {
      return res.status(409).json({ message: 'You are already enrolled in this course.' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      enrollmentDate: new Date(),
      status: 'active'
    });

    const enrollmentWithCourse = await Enrollment.findByPk(enrollment.id, {
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'firstName', 'lastName']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      message: 'Enrolled successfully.',
      enrollment: enrollmentWithCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to enroll in course.', error: error.message });
  }
};

// Get user's enrolled courses
const getMyEnrollments = async (req, res) => {
  try {
    const userId = req.user.id;

    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: 'course',
          include: [
            {
              model: User,
              as: 'instructor',
              attributes: ['id', 'firstName', 'lastName']
            },
            {
              model: Section,
              as: 'sections',
              include: [
                {
                  model: Lesson,
                  as: 'lessons'
                }
              ]
            }
          ]
        }
      ],
      order: [['enrollment_date', 'DESC']]
    });

    res.json({ enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enrollments.', error: error.message });
  }
};

// Check enrollment status
const checkEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      where: { userId, courseId }
    });

    res.json({
      isEnrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to check enrollment status.', error: error.message });
  }
};

// Unenroll from a course
const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      where: { userId, courseId }
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found.' });
    }

    await enrollment.destroy();

    res.json({ message: 'Unenrolled successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unenroll from course.', error: error.message });
  }
};

module.exports = {
  enrollInCourse,
  getMyEnrollments,
  checkEnrollmentStatus,
  unenrollFromCourse
};
