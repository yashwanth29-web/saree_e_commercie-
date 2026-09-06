const fs = require('fs');
const path = require('path');

function getFiles(dir, exts = ['.ts', '.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, exts));
    } else if (exts.includes(path.extname(file))) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles('src');
const missing = [];
const imgRegex = /['"](\/(?:products|sarees)\/[^'"]+?\.(?:jpg|jpeg|png|svg|webp))['"]/g;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const imgPath = match[1].split('?')[0];
    const disk = path.join(process.cwd(), 'public', imgPath);
    if (!fs.existsSync(disk)) {
      missing.push({ file: path.relative(process.cwd(), file), imgPath });
    }
  }
}

console.log('SCAN RESULTS - MISSING IMAGES:');
console.log(JSON.stringify(missing, null, 2));
