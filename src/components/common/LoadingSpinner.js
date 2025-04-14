import React from 'react';
import '../../assets/css/loadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = '#007bff' }) => {
  return (
    <div className="loading-spinner" style={{ borderColor: `${color} transparent ${color} transparent` }}>
      <span className="visually-hidden">Chargement...</span>
    </div>
  );
};

export default LoadingSpinner;