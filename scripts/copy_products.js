const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\yashw\\.gemini\\antigravity-ide\\brain\\d13b8928-7823-46fa-b0a3-4becc3d74e13\\.user_uploaded';
const destDir = path.join(__dirname, '..', 'public', 'products');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fileMap = {
  // Batch 1: Kalamkari
  'media_1788610748045.jpg': 'kalamkari-peacock-lotus.jpg',
  'media_1788610748107.jpg': 'kalamkari-pichwai-cow.jpg',
  'media_1788610748184.jpg': 'kalamkari-radha-krishna.jpg',
  'media_1788610748277.jpg': 'kalamkari-river-maiden.jpg',
  'media_1788610748338.jpg': 'kalamkari-forest-deer.jpg',

  // Batch 2: Mangalagiri Pattu Silver Zari
  'media_1788610930230.jpg': 'mangalagiri-pattu-sky-blue.jpg',
  'media_1788610930390.jpg': 'mangalagiri-pattu-rani-pink.jpg',
  'media_1788610930474.jpg': 'mangalagiri-pattu-wine-maroon.jpg',
  'media_1788610930527.jpg': 'mangalagiri-pattu-royal-purple.jpg',
  'media_1788610930647.jpg': 'mangalagiri-pattu-peacock-teal.jpg',

  // Batch 3: Mangalagiri Cotton with Contrast Blouse & Tassels
  'media_1788611028111.jpg': 'mangalagiri-cotton-yellow-bandhani.jpg',
  'media_1788611028215.jpg': 'mangalagiri-cotton-orange-floral.jpg',
  'media_1788611028314.jpg': 'mangalagiri-cotton-sage-check.jpg',
  'media_1788611028387.jpg': 'mangalagiri-cotton-mint-floral.jpg',
  'media_1788611028486.jpg': 'mangalagiri-cotton-maroon-ikkat.jpg',
};

console.log('Copying 15 images to public/products...');
for (const [srcFile, destFile] of Object.entries(fileMap)) {
  const srcPath = path.join(srcDir, srcFile);
  const destPath = path.join(destDir, destFile);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied: ${destFile} (${fs.statSync(destPath).size} bytes)`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
}
console.log('Done!');
