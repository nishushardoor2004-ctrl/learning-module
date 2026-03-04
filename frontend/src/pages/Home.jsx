import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          color: 'white',
          marginBottom: '3rem'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Welcome to LMS Platform
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.9 }}>
            Learn from the best instructors. Anytime, anywhere.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/courses" className="btn" style={{ 
              background: 'white', 
              color: '#667eea',
              fontSize: '1.1rem',
              padding: '1rem 2rem'
            }}>
              Browse Courses
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-outline" style={{ 
                borderColor: 'white', 
                color: 'white',
                fontSize: '1.1rem',
                padding: '1rem 2rem'
              }}>
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#2c3e50' }}>
            Why Choose Our Platform?
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3>Quality Content</h3>
              <p style={{ color: '#666' }}>Learn from expertly crafted courses by industry professionals.</p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3>Track Progress</h3>
              <p style={{ color: '#666' }}>Monitor your learning journey with detailed progress tracking.</p>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
              <h3>Learn Anywhere</h3>
              <p style={{ color: '#666' }}>Access your courses anytime, anywhere, on any device.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
