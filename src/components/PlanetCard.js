import React from 'react';

const PlanetCard = ({ title, description, links, onClose }) => {
  return (
    <div className="planet-card-wrapper">
      <h2>{title}</h2>
      <p>{description}</p>
      {links &&
        links.map((link, index) => (
          <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
            {link.text}
          </a>
        ))}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PlanetCard;
