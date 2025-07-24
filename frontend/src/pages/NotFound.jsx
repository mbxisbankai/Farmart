// pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 — Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <p>
      <Link to="/">Go back home</Link>
    </p>
  </div>
);

export default NotFound;
