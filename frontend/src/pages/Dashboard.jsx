import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/enrollmentService';
import { progressService } from '../services/progressService';
import CourseCard from '../components/CourseCard';
import ProgressBar from '../components/ProgressBar';

const Dashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await enrollmentService.getMyEnrollments();
      setEnrollments(data.enrollments);

      // Fetch progress for each enrolled course
      const progressMap = {};
      for (const enrollment of data.enrollments) {
        try {
          const progress = await progressService.getCourseProgress(enrollment.courseId);
          progressMap[enrollment.courseId] = progress;
        } catch (err) {
          console.error(`Failed to fetch progress for course ${enrollment.courseId}`);
        }
      }
      setProgressData(progressMap);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCourseProgress = (courseId) => {
    return progressData[courseId]?.progressPercentage || 0;
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
        <h1 className="page-title">My Learning Dashboard</h1>
        
        {error && <div className="alert alert-error">{error}</div>}

        {enrollments.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Start Your Learning Journey</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              You haven't enrolled in any courses yet. Browse our courses and start learning today!
            </p>
            <Link to="/courses" className="btn btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <>
            {/* Progress Overview */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Learning Overview</h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3498db' }}>
                    {enrollments.length}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Enrolled Courses</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#27ae60' }}>
                    {Object.values(progressData).reduce((acc, p) => acc + (p.completedLessons || 0), 0)}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Lessons Completed</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: '#9b59b6' }}>
                    {Math.round(
                      Object.values(progressData).reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / 
                      (Object.keys(progressData).length || 1)
                    )}%
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Average Progress</div>
                </div>
              </div>
            </div>

            {/* Enrolled Courses */}
            <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>My Courses</h2>
            <div className="grid">
              {enrollments.map(enrollment => (
                <div key={enrollment.id}>
                  <CourseCard
                    course={enrollment.course}
                    isEnrolled={true}
                    progress={getCourseProgress(enrollment.courseId)}
                  />
                  <div className="card" style={{ marginTop: '-1rem', padding: '1rem', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
                    <ProgressBar percentage={getCourseProgress(enrollment.courseId)} />
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      <Link 
                        to={`/learn/${enrollment.courseId}`}
                        className="btn btn-primary"
                        style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem' }}
                      >
                        Continue Learning
                      </Link>
                      <Link 
                        to={`/courses/${enrollment.courseId}`}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
