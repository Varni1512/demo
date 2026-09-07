import fs from 'fs';
import path from 'path';

function walk(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') files = files.concat(walk(p));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      files.push(p);
    }
  });
  return files;
}

const files = walk('src');
let issues = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const importRegex = /from\s+['"](\.\.?[^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const dir = path.dirname(f);
    const resolved = path.resolve(dir, importPath);
    
    let candidate = resolved;
    if (!fs.existsSync(candidate)) {
      ['.jsx', '.js', '.jpeg', '.jpg', '.png', '.svg', '.css'].forEach(ext => {
        if (fs.existsSync(resolved + ext)) candidate = resolved + ext;
      });
    }
    
    if (fs.existsSync(candidate)) {
      const parent = path.dirname(candidate);
      const base = path.basename(candidate);
      const actualFiles = fs.readdirSync(parent);
      const exactMatch = actualFiles.find(name => name === base);
      if (!exactMatch) {
        const caseInsensitive = actualFiles.find(name => name.toLowerCase() === base.toLowerCase());
        issues.push({
          file: f,
          imported: importPath,
          actual: caseInsensitive
        });
      }
    }
  }
});

console.log('Case mismatch check result:', JSON.stringify(issues, null, 2));
