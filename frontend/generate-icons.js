// Simple icon generator for PWA
const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createIcon = (size) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#059669" rx="${size/8}"/>
    <circle cx="${size/2}" cy="${size/3}" r="${size/6}" fill="#ffffff"/>
    <rect x="${size/4}" y="${size/2}" width="${size/2}" height="${size/4}" fill="#ffffff" rx="${size/16}"/>
    <text x="${size/2}" y="${size*0.85}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size/8}" fill="#ffffff" font-weight="bold">F</text>
  </svg>`;
};

// Icon sizes needed
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate icons
sizes.forEach(size => {
  const svgContent = createIcon(size);
  const filename = `icon-${size}x${size}.png`;
  
  // For now, save as SVG (in production, you'd convert to PNG)
  const svgFilename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(publicDir, svgFilename), svgContent);
  
  console.log(`Generated ${svgFilename}`);
});

console.log('Icon generation complete!');
console.log('Note: In production, convert SVG files to PNG using a tool like ImageMagick or online converters.');
