import React from 'react';

const PlanetCard = ({ title, description, link, onClose }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 63, 179, 0.95)',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        zIndex: 10,
        textAlign: 'center',
      }}
    >
      <h2>{title}</h2>
      <p>{description}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">
        Learn More
      </a>
      <br />
      <button onClick={onClose} style={{ marginTop: '10px' }}>
        Close
      </button>
    </div>
  );
};

export default PlanetCard;