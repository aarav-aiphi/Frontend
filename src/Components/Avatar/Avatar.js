// File: src/components/Avatar.js

import React from 'react';

// Function to generate a consistent color based on a string (name)
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // Simple hash function
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Convert hash to hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    // Extract each color component
    const value = (hash >> (i * 8)) & 0xff;
    color += (`00${value.toString(16)}`).slice(-2);
  }
  return color;
};

// Avatar Component
const Avatar = ({ name, size = 40 }) => {
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';
  const backgroundColor = stringToColor(name || 'Default');

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-bold"
      style={{
        backgroundColor,
        width: size,
        height: size,
        fontSize: size / 2, // Adjust font size based on avatar size
      }}
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;
