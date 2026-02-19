// Run this with Node.js to generate icon files
// Install: npm install canvas
// Run: node create-icons.js

const fs = require('fs');
const { createCanvas } = require('canvas');

const sizes = [16, 48, 128];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  
  // Rounded rectangle background
  const radius = size * 0.1875;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();
  
  // White circle (gift box top)
  const circleY = size * 0.39;
  const circleRadius = size * 0.22;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(size / 2, circleY, circleRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // White bars (gift box)
  const barY1 = size * 0.64;
  const barWidth1 = size * 0.44;
  const barHeight = size * 0.0625;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.roundRect((size - barWidth1) / 2, barY1, barWidth1, barHeight, barHeight / 2);
  ctx.fill();
  
  const barY2 = size * 0.734;
  const barWidth2 = size * 0.3125;
  ctx.beginPath();
  ctx.roundRect((size - barWidth2) / 2, barY2, barWidth2, barHeight, barHeight / 2);
  ctx.fill();
  
  // Star
  const starSize = size * 0.125;
  const starX = size / 2;
  const starY = circleY;
  ctx.fillStyle = '#667eea';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
    const x = starX + Math.cos(angle) * starSize;
    const y = starY + Math.sin(angle) * starSize;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  
  // "FREE" text for larger icons
  if (size >= 48) {
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.125}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FREE', size / 2, size * 0.898);
  }
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`icon${size}.png`, buffer);
  console.log(`Created icon${size}.png`);
});

console.log('All icons created successfully!');
