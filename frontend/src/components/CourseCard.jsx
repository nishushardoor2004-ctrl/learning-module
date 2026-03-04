import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, isEnrolled, progress }) => {
  const instructorName = course.instructor 
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : 'Unknown Instructor';

  return (
    <div className="card">
      <img 
        src={course.thumbnail || 'https://via.placeholder.com/400x200?text=Course+Thumbnail'} 
        alt={course.title}
        className="card-image"
      />
      <div className="card-body">
        <h3 className="card-title">{course.title}</h3>
        <p className="card-text" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
          by {instructorName}
        </p>
        <p className="card-text">
          {course.description?.substring(0, 100)}...
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ 
            background: '#ecf0f1', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: '#666'
          }}>
            {course.category || 'General'}
          </span>
          {isEnrolled ? (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: '#27ae60', marginBottom: '0.25rem' }}>
                {progress}% Complete
              </div>
              <Link to={`/learn/${course.id}`} className="btn btn-success" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                Continue
              </Link>
            </div>
          ) : (
            <Link to={`/courses/${course.id}`} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
