const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Section = require('./Section');
const Lesson = require('./Lesson');
const Enrollment = require('./Enrollment');
const Progress = require('./Progress');

// Define associations

// User (Instructor) has many Courses
User.hasMany(Course, { foreignKey: 'instructorId', as: 'courses' });
Course.belongsTo(User, { foreignKey: 'instructorId', as: 'instructor' });

// Course has many Sections
Course.hasMany(Section, { foreignKey: 'courseId', as: 'sections' });
Section.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Section has many Lessons
Section.hasMany(Lesson, { foreignKey: 'sectionId', as: 'lessons' });
Lesson.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

// User has many Enrollments
User.hasMany(Enrollment, { foreignKey: 'userId', as: 'enrollments' });
Enrollment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Course has many Enrollments
Course.hasMany(Enrollment, { foreignKey: 'courseId', as: 'enrollments' });
Enrollment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User has many Progress records
User.hasMany(Progress, { foreignKey: 'userId', as: 'progress' });
Progress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Lesson has many Progress records
Lesson.hasMany(Progress, { foreignKey: 'lessonId', as: 'progress' });
Progress.belongsTo(Lesson, { foreignKey: 'lessonId', as: 'lesson' });

module.exports = {
  sequelize,
  User,
  Course,
  Section,
  Lesson,
  Enrollment,
  Progress
};
