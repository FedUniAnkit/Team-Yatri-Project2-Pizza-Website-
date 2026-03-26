import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{maxWidth: 720, margin: '2rem auto', padding: '2rem', textAlign: 'center'}}>
      <h1 style={{fontSize: '3rem', marginBottom: '0.5rem', color: '#e74c3c'}}>Unauthorized</h1>
      <p style={{color: '#6c757d', marginBottom: '1.5rem'}}>
        You need to be logged in with an Admin account to view this page.
      </p>
      <div style={{display:'flex', gap: 12, justifyContent:'center', flexWrap:'wrap'}}>
        <Link to="/login" className="nav-button primary">Go to Login</Link>
        <Link to="/" className="nav-button">Go to Homepage</Link>
      </div>
      <p style={{marginTop:'1rem', color:'#6c757d'}}>
        If you believe this is a mistake, please log out and log back in as an Admin user.
      </p>
    </div>
  );
};

export default Unauthorized;
