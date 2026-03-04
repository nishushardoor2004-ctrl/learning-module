const { Progress, Lesson, Section, Course } = require('../models');
const { calculateProgress } = require('../utils/helpers');

// Mark lesson as complete
const markLessonComplete = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user.id;

    // Check if lesson exists
    const lesson = await Lesson.findByPk(lessonId, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [{ model: Course, as: 'course' }]
        }
      ]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    // Check if user is enrolled in the course
    const { Enrollment } = require('../models');
    const enrollment = await Enrollment.findOne({
      where: {
        userId,
        courseId: lesson.section.courseId
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to track progress.' });
    }

    // Find or create progress record
    let progress = await Progress.findOne({
      where: { userId, lessonId }
    });

    if (progress) {
      await progress.update({
        completed: true,
        completedAt: new Date(),
        lastWatchedAt: new Date()
      });
    } else {
      progress = await Progress.create({
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
        lastWatchedAt: new Date()
      });
    }

    res.json({
      message: 'Lesson marked as complete.',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress.', error: error.message });
  }
};

// Update last watched (without marking complete)
const updateLastWatched = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const userId = req.user.id;

    // Check if lesson exists
    const lesson = await Lesson.findByPk(lessonId, {
      include: [
        {
          model: Section,
          as: 'section',
          include: [{ model: Course, as: 'course' }]
        }
      ]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    // Check if user is enrolled in the course
    const { Enrollment } = require('../models');
    const enrollment = await Enrollment.findOne({
      where: {
        userId,
        courseId: lesson.section.courseId
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in this course to track progress.' });
    }

    // Find or create progress record
    let progress = await Progress.findOne({
      where: { userId, lessonId }
    });

    if (progress) {
      await progress.update({
        lastWatchedAt: new Date()
      });
    } else {
      progress = await Progress.create({
        userId,
        lessonId,
        completed: false,
        lastWatchedAt: new Date()
      });
    }

    res.json({
      message: 'Last watched updated.',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress.', error: error.message });
  }
};

// Get progress for a course
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Get course with all lessons
    const course = await Course.findByPk(courseId, {
      include: [
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
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Get all lesson IDs for this course
    const lessonIds = [];
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        lessonIds.push(lesson.id);
      });
    });

    // Get progress records for these lessons
    const progressRecords = await Progress.findAll({
      where: {
        userId,
        lessonId: lessonIds
      }
    });

    // Calculate statistics
    const totalLessons = lessonIds.length;
    const completedLessons = progressRecords.filter(p => p.completed).length;
    const progressPercentage = calculateProgress(completedLessons, totalLessons);

    // Find last watched lesson
    let lastWatchedLesson = null;
    let lastWatchedAt = null;

    progressRecords.forEach(progress => {
      if (progress.lastWatchedAt && (!lastWatchedAt || new Date(progress.lastWatchedAt) > new Date(lastWatchedAt))) {
        lastWatchedAt = progress.lastWatchedAt;
        lastWatchedLesson = lessonIds.find(id => id === progress.lessonId);
      }
    });

    // Get lesson details for last watched
    let lastWatchedLessonDetails = null;
    if (lastWatchedLesson) {
      lastWatchedLessonDetails = await Lesson.findByPk(lastWatchedLesson, {
        include: [
          {
            model: Section,
            as: 'section',
            attributes: ['id', 'title', 'orderNumber']
          }
        ]
      });
    }

    res.json({
      courseId: parseInt(courseId),
      totalLessons,
      completedLessons,
      progressPercentage,
      lastWatchedLesson: lastWatchedLessonDetails,
      progressRecords: progressRecords.map(p => ({
        lessonId: p.lessonId,
        completed: p.completed,
        completedAt: p.completedAt,
        lastWatchedAt: p.lastWatchedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress.', error: error.message });
  }
};

// Get all progress for user
const getAllProgress = async (req, res) => {
  try {
    const userId = req.user.id;

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
              include: [
                {
                  model: Course,
                  as: 'course'
                }
              ]
            }
          ]
        }
      ]
    });

    res.json({ progress: progressRecords });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch progress.', error: error.message });
  }
};

module.exports = {
  markLessonComplete,
  updateLastWatched,
  getCourseProgress,
  getAllProgress
};
