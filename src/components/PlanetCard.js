import React from 'react';

const PlanetCard = ({ title, description, links, onClose }) => {
  return (
    <div className="planet-card-wrapper">
      <h2>{Earth}</h2>
      <p style={{ whiteSpace: 'pre-line' }}>{description}</p> {/* Handle multiline content */}

      {/* Render multiple links dynamically */}
      {links && links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.text}
        </a>
      ))}

      {/* Close button */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PlanetCard;
