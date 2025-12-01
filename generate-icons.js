const sharp = require('sharp');
const fs = require('fs');

async function generateIcons() {
  const inputImage = 'public/hockey-skates.jpeg';
  
  // Generate 192x192 icon
  await sharp(inputImage)
    .resize(192, 192, {
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toFile('public/icon-192x192.png');
  
  // Generate 512x512 icon
  await sharp(inputImage)
    .resize(512, 512, {
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toFile('public/icon-512x512.png');
  
  // Generate apple-touch-icon
  await sharp(inputImage)
    .resize(180, 180, {
      fit: 'cover',
      position: 'center'
    })
    .png()
    .toFile('public/apple-touch-icon.png');

  console.log('✅ Icons generated successfully!');
}

generateIcons().catch(console.error);
