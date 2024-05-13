// src/NavigationMenu.js
import React from 'react';

const NavigationMenu = ({ onSelectHeading }) => {
  const headings = ['Map', 'Description', 'Chat'];

  return (
    <div className="navigation-menu">
      {headings.map((heading) => (
        <button
          key={heading}
          onClick={() => onSelectHeading(heading)}
        >
          {heading}
        </button>
      ))}
    </div>
  );
};

export default NavigationMenu;
