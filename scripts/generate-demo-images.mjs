import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public/products');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const images = [
  { name: 'mangalagiri-cotton-maroon-01.svg', color: '#7A211B', text: 'Maroon Cotton Saree' },
  { name: 'mangalagiri-cotton-maroon-02.svg', color: '#7A211B', text: 'Maroon Pallu Detail' },
  { name: 'mangalagiri-pattu-green-01.svg', color: '#1F7A4C', text: 'Green Pattu Saree' },
  { name: 'mangalagiri-pattu-green-02.svg', color: '#1F7A4C', text: 'Green Zari Border' },
  { name: 'mangalagiri-dress-material-gold-01.svg', color: '#B79555', text: 'Gold Dress Material' }
];

images.forEach(img => {
  const svg = `<svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${img.color}" />
    <rect width="90%" height="90%" x="5%" y="5%" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="10,10" opacity="0.3" />
    <text x="50%" y="50%" font-family="sans-serif" font-size="32" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">DL HANDLOOMS DEMO</text>
    <text x="50%" y="55%" font-family="sans-serif" font-size="24" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" opacity="0.8">${img.text}</text>
  </svg>`;
  
  fs.writeFileSync(path.join(publicDir, img.name), svg);
  console.log(`Created ${img.name}`);
});
