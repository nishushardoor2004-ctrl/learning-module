import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourseDetails();
    if (isAuthenticated) {
      checkEnrollmentStatus();
    }
  }, [id, isAuthenticated]);

  const fetchCourseDetails = async () => {
    try {
      const data = await courseService.getCourseById(id);
      setCourse(data.course);
    } catch (err) {
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const data = await enrollmentService.checkEnrollmentStatus(id);
      setIsEnrolled(data.isEnrolled);
    } catch (err) {
      console.error('Failed to check enrollment status');
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setEnrolling(true);
    setError('');
    
    try {
      await enrollmentService.enrollInCourse(parseInt(id));
      setIsEnrolled(true);
      setSuccess('Successfully enrolled in the course!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    navigate(`/learn/${id}`);
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

  if (!course) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-error">Course not found</div>
        </div>
      </div>
    );
  }

  const instructorName = course.instructor 
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : 'Unknown Instructor';

  return (
    <div className="page">
      <div className="container">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', padding: '2rem' }}>
            <div>
              <img 
                src={course.thumbnail || 'https://via.placeholder.com/400x300?text=Course+Thumbnail'}
                alt={course.title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </div>
            <div>
              <span style={{ 
                background: '#ecf0f1', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: '#666'
              }}>
                {course.category || 'General'}
              </span>
              
              <h1 style={{ fontSize: '2rem', margin: '1rem 0', color: '#2c3e50' }}>
                {course.title}
              </h1>
              
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Instructor: <strong>{instructorName}</strong>
              </p>
              
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                <div>
                  <strong>{course.totalLessons}</strong> Lessons
                </div>
                <div>
                  <strong>{course.totalDuration}</strong> Minutes
                </div>
              </div>
              
              {isEnrolled ? (
                <button 
                  onClick={handleStartLearning}
                  className="btn btn-success"
                  style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                >
                  Continue Learning
                </button>
              ) : (
                <button 
                  onClick={handleEnroll}
                  className="btn btn-primary"
                  style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>About This Course</h2>
              <p style={{ lineHeight: '1.8', color: '#555' }}>
                {course.description || 'No description available.'}
              </p>
            </div>

            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="card" style={{ padding: '1.5rem' }}>
                <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>What You Will Learn</h2>
                <ul style={{ lineHeight: '2', color: '#555', paddingLeft: '1.5rem' }}>
                  {course.learningOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Course Content</h2>
              
              {course.sections?.map((section, sectionIndex) => (
                <div key={section.id} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    color: '#2c3e50',
                    marginBottom: '0.75rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid #eee'
                  }}>
                    Section {sectionIndex + 1}: {section.title}
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {section.lessons?.map((lesson, lessonIndex) => (
                      <li 
                        key={lesson.id}
                        style={{ 
                          padding: '0.5rem 0',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <span style={{ 
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: '#ecf0f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          flexShrink: 0
                        }}>
                          {lessonIndex + 1}
                        </span>
                        <span>{lesson.title}</span>
                        {lesson.duration && (
                          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: '#999' }}>
                            {lesson.duration} min
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {(!course.sections || course.sections.length === 0) && (
                <p style={{ color: '#999', textAlign: 'center' }}>
                  No content available yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
