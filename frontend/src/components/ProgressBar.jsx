import React from 'react';

const ProgressBar = ({ percentage, showLabel = true }) => {
  return (
    <div>
      {showLabel && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <span>Progress</span>
          <span style={{ fontWeight: 600, color: '#27ae60' }}>{percentage}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
