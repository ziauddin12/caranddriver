import React from 'react';
import Navbar from './Navbar';

function NotFound() {
  return (
    <>
    <Navbar/>
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for doesn't exist.</p>
    </div>
    </>
  );
}

export default NotFound;
