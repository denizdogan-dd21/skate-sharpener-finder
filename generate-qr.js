const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const url = 'https://skate-sharpener-finder.vercel.app';
const outputPath = path.join(__dirname, 'public', 'app-qr-code.png');

// Generate QR code and save as PNG
QRCode.toFile(outputPath, url, {
  color: {
    dark: '#000000',  // Black dots
    light: '#FFFFFF'  // White background
  },
  width: 512,  // Size in pixels
  margin: 2    // Margin around QR code
}, function (err) {
  if (err) {
    console.error('Error generating QR code:', err);
    process.exit(1);
  }
  console.log('✓ QR code generated successfully!');
  console.log('✓ Saved to: public/app-qr-code.png');
  console.log('✓ URL encoded:', url);
  console.log('\nYou can now use this QR code to share your app!');
});
