import React from 'react';

function SimpleApp() {
  console.log('SimpleApp is rendering');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h1 style={{ color: '#333', marginBottom: '1rem' }}>🚀 AI Resume Platform</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Application is working! The routing will be restored shortly.
        </p>
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          borderRadius: '5px',
          fontSize: '14px',
          color: '#495057'
        }}>
          <strong>Status:</strong> ✅ React App Loaded Successfully
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;