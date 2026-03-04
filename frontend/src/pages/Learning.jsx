import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { lessonService } from '../services/lessonService';
import { progressService } from '../services/progressService';
import { enrollmentService } from '../services/enrollmentService';
import ProgressBar from '../components/ProgressBar';

const Learning = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkEnrollmentAndLoadCourse();
  }, [courseId]);

  const checkEnrollmentAndLoadCourse = async () => {
    try {
      // Check if enrolled
      const enrollmentData = await enrollmentService.checkEnrollmentStatus(courseId);
      if (!enrollmentData.isEnrolled) {
        navigate(`/courses/${courseId}`);
        return;
      }

      // Load course with progress
      const courseData = await courseService.getCourseWithProgress(courseId);
      setCourse(courseData.course);

      // Load progress
      const progressData = await progressService.getCourseProgress(courseId);
      setProgress(progressData);
      
      // Set completed lessons
      const completed = new Set(
        progressData.progressRecords
          .filter(p => p.completed)
          .map(p => p.lessonId)
      );
      setCompletedLessons(completed);

      // Determine which lesson to show
      let lessonToShow = null;
      
      // Try to get last watched lesson
      if (progressData.lastWatchedLesson) {
        lessonToShow = progressData.lastWatchedLesson;
      } else {
        // Find first incomplete lesson or first lesson
        const allLessons = [];
        courseData.course.sections.forEach(section => {
          section.lessons.forEach(lesson => {
            allLessons.push(lesson);
          });
        });
        
        lessonToShow = allLessons.find(l => !completed.has(l.id)) || allLessons[0];
      }

      if (lessonToShow) {
        loadLesson(lessonToShow.id);
      }
    } catch (err) {
      setError('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const loadLesson = async (lessonId) => {
    try {
      const data = await lessonService.getLessonById(lessonId);
      setCurrentLesson(data.lesson);
      
      // Update last watched
      await progressService.updateLastWatched(lessonId);
    } catch (err) {
      console.error('Failed to load lesson');
    }
  };

  const handleLessonClick = (lesson) => {
    loadLesson(lesson.id);
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    
    try {
      await progressService.markLessonComplete(currentLesson.id);
      setCompletedLessons(prev => new Set([...prev, currentLesson.id]));
      
      // Refresh progress
      const progressData = await progressService.getCourseProgress(courseId);
      setProgress(progressData);
    } catch (err) {
      console.error('Failed to mark lesson complete');
    }
  };

  const handlePreviousLesson = () => {
    if (!course || !currentLesson) return;
    
    const allLessons = [];
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        allLessons.push(lesson);
      });
    });
    
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex > 0) {
      loadLesson(allLessons[currentIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    if (!course || !currentLesson) return;
    
    const allLessons = [];
    course.sections.forEach(section => {
      section.lessons.forEach(lesson => {
        allLessons.push(lesson);
      });
    });
    
    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      loadLesson(allLessons[currentIndex + 1].id);
    }
  };

  const getYouTubeEmbedUrl = (youtubeId) => {
    if (!youtubeId) return '';
    return `https://www.youtube.com/embed/${youtubeId}?rel=0`;
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

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ padding: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', height: 'calc(100vh - 64px)' }}>
        {/* Main Content */}
        <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
          {/* Video Player */}
          <div className="video-container" style={{ marginBottom: '1.5rem' }}>
            {currentLesson?.youtubeId ? (
              <iframe
                src={getYouTubeEmbedUrl(currentLesson.youtubeId)}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                color: '#666'
              }}>
                Select a lesson to start learning
              </div>
            )}
          </div>

          {/* Lesson Info */}
          {currentLesson && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#2c3e50' }}>
                    {currentLesson.title}
                  </h1>
                  <p style={{ color: '#666' }}>
                    {currentLesson.section?.title}
                  </p>
                </div>
                <div>
                  {completedLessons.has(currentLesson.id) ? (
                    <span style={{ 
                      background: '#27ae60', 
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}>
                      Completed
                    </span>
                  ) : (
                    <button 
                      onClick={handleMarkComplete}
                      className="btn btn-success"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
              
              {currentLesson.description && (
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  {currentLesson.description}
                </p>
              )}

              {/* Navigation */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #eee'
              }}>
                <button 
                  onClick={handlePreviousLesson}
                  className="btn btn-secondary"
                >
                  Previous Lesson
                </button>
                <button 
                  onClick={handleNextLesson}
                  className="btn btn-primary"
                >
                  Next Lesson
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ 
          background: '#f8f9fa', 
          borderLeft: '1px solid #dee2e6',
          overflowY: 'auto',
          padding: '1rem'
        }}>
          {/* Course Progress */}
          <div className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#2c3e50' }}>
              {course?.title}
            </h3>
            {progress && (
              <ProgressBar percentage={progress.progressPercentage} />
            )}
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              {progress?.completedLessons || 0} of {progress?.totalLessons || 0} lessons completed
            </p>
          </div>

          {/* Lesson List */}
          <div className="lesson-sidebar">
            {course?.sections?.map((section, sectionIndex) => (
              <div key={section.id}>
                <div style={{ 
                  padding: '0.75rem 1rem',
                  background: '#e9ecef',
                  fontWeight: 600,
                  color: '#495057',
                  fontSize: '0.9rem'
                }}>
                  {section.title}
                </div>
                {section.lessons?.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className={`lesson-item ${currentLesson?.id === lesson.id ? 'active' : ''} ${completedLessons.has(lesson.id) ? 'completed' : ''}`}
                    onClick={() => handleLessonClick(lesson)}
                  >
                    <div className="lesson-number">
                      {completedLessons.has(lesson.id) ? '✓' : lessonIndex + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                        {lesson.title}
                      </div>
                      {lesson.duration && (
                        <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                          {lesson.duration} min
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
