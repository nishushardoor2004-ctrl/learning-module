const { Lesson, Section, Course } = require('../models');
const { extractYouTubeId } = require('../utils/helpers');

// Get lesson by ID
const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id, {
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
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found.' });
    }

    // Extract YouTube video ID
    const youtubeId = extractYouTubeId(lesson.youtubeUrl);

    res.json({
      lesson: {
        ...lesson.toJSON(),
        youtubeId
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch lesson.', error: error.message });
  }
};

// Create new lesson
const createLesson = async (req, res) => {
  try {
    const { sectionId, title, description, orderNumber, youtubeUrl, duration } = req.body;

    // Check if section exists
    const section = await Section.findByPk(sectionId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found.' });
    }

    // Check permissions
    if (section.course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const lesson = await Lesson.create({
      sectionId,
      title,
      description,
      orderNumber: orderNumber || 1,
      youtubeUrl,
      duration
    });

    res.status(201).json({
      message: 'Lesson created successfully.',
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create lesson.', error: error.message });
  }
};

// Update lesson
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, orderNumber, youtubeUrl, duration } = req.body;

    const lesson = await Lesson.findByPk(id, {
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

    // Check permissions
    if (lesson.section.course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await lesson.update({
      title: title || lesson.title,
      description: description || lesson.description,
      orderNumber: orderNumber || lesson.orderNumber,
      youtubeUrl: youtubeUrl || lesson.youtubeUrl,
      duration: duration || lesson.duration
    });

    res.json({
      message: 'Lesson updated successfully.',
      lesson
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update lesson.', error: error.message });
  }
};

// Delete lesson
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByPk(id, {
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

    // Check permissions
    if (lesson.section.course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await lesson.destroy();

    res.json({ message: 'Lesson deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete lesson.', error: error.message });
  }
};

module.exports = {
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};
