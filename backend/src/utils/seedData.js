const { sequelize, User, Course, Section, Lesson } = require('../models');
const { hashPassword } = require('./helpers');

const seedData = async () => {
  try {
    console.log('Starting database seeding...');

    // Create instructor user
    const instructorPassword = await hashPassword('password123');
    const instructor = await User.create({
      email: 'instructor@example.com',
      password: instructorPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'instructor'
    });
    console.log('Created instructor:', instructor.email);

    // Create student user
    const studentPassword = await hashPassword('password123');
    const student = await User.create({
      email: 'student@example.com',
      password: studentPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'student'
    });
    console.log('Created student:', student.email);

    // Create Java Programming Course
    const javaCourse = await Course.create({
      title: 'Java Programming Masterclass',
      description: 'Learn Java programming from scratch. This comprehensive course covers everything from basic syntax to advanced concepts like multithreading, collections, and object-oriented programming.',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      category: 'Programming',
      instructorId: instructor.id,
      learningOutcomes: [
        'Master Java syntax and fundamentals',
        'Understand Object-Oriented Programming principles',
        'Work with Java Collections Framework',
        'Build multithreaded applications',
        'Create real-world Java projects'
      ]
    });
    console.log('Created course:', javaCourse.title);

    // Create sections for Java course
    const javaSection1 = await Section.create({
      courseId: javaCourse.id,
      title: 'Introduction to Java',
      orderNumber: 1
    });

    const javaSection2 = await Section.create({
      courseId: javaCourse.id,
      title: 'Object-Oriented Programming',
      orderNumber: 2
    });

    const javaSection3 = await Section.create({
      courseId: javaCourse.id,
      title: 'Advanced Java Concepts',
      orderNumber: 3
    });

    // Create lessons for Java course
    await Lesson.bulkCreate([
      // Section 1: Introduction to Java
      {
        sectionId: javaSection1.id,
        title: 'Setting Up Java Development Environment',
        description: 'Learn how to install JDK and set up your development environment.',
        orderNumber: 1,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 15
      },
      {
        sectionId: javaSection1.id,
        title: 'Java Basics - Variables and Data Types',
        description: 'Understanding variables, primitive types, and type casting in Java.',
        orderNumber: 2,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 20
      },
      {
        sectionId: javaSection1.id,
        title: 'Control Flow Statements',
        description: 'Learn about if-else, switch, loops, and break/continue statements.',
        orderNumber: 3,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 25
      },
      // Section 2: OOP
      {
        sectionId: javaSection2.id,
        title: 'Classes and Objects',
        description: 'Understanding the foundation of OOP - classes and objects.',
        orderNumber: 1,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 30
      },
      {
        sectionId: javaSection2.id,
        title: 'Inheritance and Polymorphism',
        description: 'Learn how to extend classes and implement polymorphism.',
        orderNumber: 2,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 35
      },
      {
        sectionId: javaSection2.id,
        title: 'Encapsulation and Abstraction',
        description: 'Master access modifiers, getters/setters, and abstract classes.',
        orderNumber: 3,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 28
      },
      // Section 3: Advanced
      {
        sectionId: javaSection3.id,
        title: 'Exception Handling',
        description: 'Learn to handle errors gracefully with try-catch and custom exceptions.',
        orderNumber: 1,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 22
      },
      {
        sectionId: javaSection3.id,
        title: 'Collections Framework',
        description: 'Working with Lists, Sets, Maps, and other collections.',
        orderNumber: 2,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 40
      },
      {
        sectionId: javaSection3.id,
        title: 'Multithreading in Java',
        description: 'Create concurrent applications with threads and executors.',
        orderNumber: 3,
        youtubeUrl: 'https://www.youtube.com/watch?v=grEKMHGYyns',
        duration: 45
      }
    ]);
    console.log('Created Java course lessons');

    // Create Web Development Course
    const webCourse = await Course.create({
      title: 'Complete Web Development Bootcamp',
      description: 'Become a full-stack web developer with just one course. HTML, CSS, JavaScript, Node.js and more!',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      category: 'Web Development',
      instructorId: instructor.id,
      learningOutcomes: [
        'Build responsive websites with HTML5 and CSS3',
        'Master JavaScript ES6+ features',
        'Create backend APIs with Node.js',
        'Work with databases and authentication',
        'Deploy applications to production'
      ]
    });
    console.log('Created course:', webCourse.title);

    // Create sections for Web course
    const webSection1 = await Section.create({
      courseId: webCourse.id,
      title: 'Frontend Fundamentals',
      orderNumber: 1
    });

    const webSection2 = await Section.create({
      courseId: webCourse.id,
      title: 'Backend Development',
      orderNumber: 2
    });

    // Create lessons for Web course
    await Lesson.bulkCreate([
      // Section 1: Frontend
      {
        sectionId: webSection1.id,
        title: 'HTML5 Fundamentals',
        description: 'Learn the building blocks of the web - HTML tags, structure, and semantics.',
        orderNumber: 1,
        youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
        duration: 25
      },
      {
        sectionId: webSection1.id,
        title: 'CSS3 Styling and Layout',
        description: 'Master CSS selectors, box model, flexbox, and grid layouts.',
        orderNumber: 2,
        youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
        duration: 30
      },
      {
        sectionId: webSection1.id,
        title: 'JavaScript Basics',
        description: 'Introduction to JavaScript variables, functions, and DOM manipulation.',
        orderNumber: 3,
        youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
        duration: 35
      },
      // Section 2: Backend
      {
        sectionId: webSection2.id,
        title: 'Introduction to Node.js',
        description: 'Setting up Node.js and creating your first server.',
        orderNumber: 1,
        youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
        duration: 28
      },
      {
        sectionId: webSection2.id,
        title: 'Express.js Framework',
        description: 'Building REST APIs with Express.js middleware and routing.',
        orderNumber: 2,
        youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
        duration: 32
      },
      {
        sectionId: webSection2.id,
        title: 'Database Integration',
        description: 'Working with MongoDB and Mongoose for data persistence.',
        orderNumber: 3,
        youtubeUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
        duration: 38
      }
    ]);
    console.log('Created Web Development course lessons');

    console.log('Database seeding completed successfully!');
    console.log('\nTest Accounts:');
    console.log('Instructor: instructor@example.com / password123');
    console.log('Student: student@example.com / password123');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

module.exports = seedData;

// Run if executed directly
if (require.main === module) {
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '../../.env') });
  
  seedData()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}