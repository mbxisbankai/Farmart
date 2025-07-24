// pages/Dashboard.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const animals = useSelector(state => state.animals.list);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Dashboard</h1>
      <p>Total animals: {animals.length}</p>
      {animals.length > 0 ? (
        <ul>
          {animals.map(a => (
            <li key={a.id}>{a.name} — {a.species}</li>
          ))}
        </ul>
      ) : (
        <p>No animals added yet.</p>
      )}
    </div>
  );
};

export default Dashboard;
