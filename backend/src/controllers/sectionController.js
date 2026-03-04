const { Section, Course, Lesson } = require('../models');

// Get all sections for a course
const getSectionsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const sections = await Section.findAll({
      where: { courseId },
      include: [
        {
          model: Lesson,
          as: 'lessons',
          order: [['order_number', 'ASC']]
        }
      ],
      order: [['order_number', 'ASC']]
    });

    res.json({ sections });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sections.', error: error.message });
  }
};

// Create new section
const createSection = async (req, res) => {
  try {
    const { courseId, title, orderNumber } = req.body;

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Check permissions
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const section = await Section.create({
      courseId,
      title,
      orderNumber: orderNumber || 1
    });

    res.status(201).json({
      message: 'Section created successfully.',
      section
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create section.', error: error.message });
  }
};

// Update section
const updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, orderNumber } = req.body;

    const section = await Section.findByPk(id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found.' });
    }

    // Check permissions
    if (section.course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await section.update({
      title: title || section.title,
      orderNumber: orderNumber || section.orderNumber
    });

    res.json({
      message: 'Section updated successfully.',
      section
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update section.', error: error.message });
  }
};

// Delete section
const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;

    const section = await Section.findByPk(id, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found.' });
    }

    // Check permissions
    if (section.course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }

    await section.destroy();

    res.json({ message: 'Section deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete section.', error: error.message });
  }
};

module.exports = {
  getSectionsByCourse,
  createSection,
  updateSection,
  deleteSection
};
