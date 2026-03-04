const { Course, User, Section, Lesson, Enrollment, sequelize } = require('../models');
const { calculateProgress } = require('../utils/helpers');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch courses.', error: error.message });
  }
};

// Get course by ID with sections and lessons
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              order: [['order_number', 'ASC']]
            }
          ],
          order: [['order_number', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Calculate total lessons and duration
    let totalLessons = 0;
    let totalDuration = 0;
    course.sections.forEach(section => {
      totalLessons += section.lessons.length;
      section.lessons.forEach(lesson => {
        totalDuration += lesson.duration || 0;
      });
    });

    res.json({
      course: {
        ...course.toJSON(),
        totalLessons,
        totalDuration
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course.', error: error.message });
  }
};

// Create new course
const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, category, learningOutcomes } = req.body;
    const instructorId = req.user.id;

    const course = await Course.create({
      title,
      description,
      thumbnail,
      category,
      instructorId,
      learningOutcomes: learningOutcomes || []
    });

    const courseWithInstructor = await Course.findByPk(course.id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Course created successfully.',
      course: courseWithInstructor
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create course.', error: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, category, learningOutcomes } = req.body;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if user is instructor or admin
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only update your own courses.' });
    }

    await course.update({
      title: title || course.title,
      description: description || course.description,
      thumbnail: thumbnail || course.thumbnail,
      category: category || course.category,
      learningOutcomes: learningOutcomes || course.learningOutcomes
    });

    const updatedCourse = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.json({
      message: 'Course updated successfully.',
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update course.', error: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check if user is instructor or admin
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only delete your own courses.' });
    }

    await course.destroy();

    res.json({ message: 'Course deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete course.', error: error.message });
  }
};

// Get course with user progress
const getCourseWithProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Section,
          as: 'sections',
          include: [
            {
              model: Lesson,
              as: 'lessons',
              order: [['order_number', 'ASC']]
            }
          ],
          order: [['order_number', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Get user's progress for this course
    const { Progress } = require('../models');
    const progressRecords = await Progress.findAll({
      where: { userId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          include: [
            {
              model: Section,
              as: 'section',
              where: { courseId: id }
            }
          ]
        }
      ]
    });

    // Calculate progress
    let totalLessons = 0;
    let completedLessons = 0;
    let lastWatchedLesson = null;
    let lastWatchedAt = null;

    course.sections.forEach(section => {
      totalLessons += section.lessons.length;
      section.lessons.forEach(lesson => {
        const progress = progressRecords.find(p => p.lessonId === lesson.id);
        if (progress) {
          if (progress.completed) {
            completedLessons++;
          }
          if (!lastWatchedAt || (progress.lastWatchedAt && new Date(progress.lastWatchedAt) > new Date(lastWatchedAt))) {
            lastWatchedAt = progress.lastWatchedAt;
            lastWatchedLesson = lesson;
          }
        }
      });
    });

    const progressPercentage = calculateProgress(completedLessons, totalLessons);

    res.json({
      course: {
        ...course.toJSON(),
        totalLessons,
        completedLessons,
        progressPercentage,
        lastWatchedLesson
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch course with progress.', error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseWithProgress
};
