import React from 'react';
import './PlanetCard.css';

const PlanetCard = ({ title, description, links, onClose }) => {
  return (
    <div className="planet-card">
      <div className="planet-card-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="planet-title">{title}</h2>
        <div className="planet-description">
          {description.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
          ))}
        </div>
        <div className="planet-links">
          {links && links.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="planet-link"
            >
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetCard;
