import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { useAuth } from '../context/AuthContext';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCourses();
    if (isAuthenticated) {
      fetchEnrollments();
    }
  }, [isAuthenticated]);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAllCourses();
      setCourses(data.courses);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data.enrollments);
      const enrolledIds = new Set(data.enrollments.map(e => e.courseId));
      setEnrolledCourseIds(enrolledIds);
    } catch (err) {
      console.error('Failed to fetch enrollments');
    }
  };

  const getEnrollmentProgress = (courseId) => {
    const enrollment = enrollments.find(e => e.courseId === courseId);
    if (!enrollment || !enrollment.course) return 0;
    
    const course = enrollment.course;
    let totalLessons = 0;
    course.sections?.forEach(section => {
      totalLessons += section.lessons?.length || 0;
    });
    
    // This is a simplified progress calculation
    // In a real app, you'd fetch actual progress data
    return 0;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">All Courses</h1>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        {courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            No courses available yet.
          </div>
        ) : (
          <div className="grid">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledCourseIds.has(course.id)}
                progress={getEnrollmentProgress(course.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
