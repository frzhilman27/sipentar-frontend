import fs from 'fs';
import path from 'path';

const dir = 'src';
const exts = ['.jsx', '.js'];

const replacements = [
  { from: /\btext-blue-600\b/g, to: 'text-sipentar-blue' },
  { from: /\btext-blue-700\b/g, to: 'text-sipentar-blue-dark' },
  { from: /\btext-blue-500\b/g, to: 'text-sipentar-blue-light' },
  { from: /\bbg-blue-600\b/g, to: 'bg-sipentar-blue' },
  { from: /\bbg-blue-700\b/g, to: 'bg-sipentar-blue-dark' },
  { from: /\bbg-blue-500\b/g, to: 'bg-sipentar-blue-light' },
  { from: /\bbg-blue-50\b/g, to: 'bg-sipentar-blue-50' },
  { from: /\bbg-blue-100\b/g, to: 'bg-sipentar-blue-100' },
  { from: /\border-blue-200\b/g, to: 'border-sipentar-blue-100' },
  { from: /\border-blue-500\b/g, to: 'border-sipentar-blue' },
  { from: /\border-blue-600\b/g, to: 'border-sipentar-blue' },
  { from: /\bring-blue-200\b/g, to: 'ring-sipentar-blue-100' },
  { from: /\bring-blue-500\b/g, to: 'ring-sipentar-blue' },
  { from: /\btext-emerald-600\b/g, to: 'text-sipentar-green' },
  { from: /\btext-emerald-700\b/g, to: 'text-sipentar-green-dark' },
  { from: /\btext-emerald-500\b/g, to: 'text-sipentar-green-light' },
  { from: /\bbg-emerald-600\b/g, to: 'bg-sipentar-green' },
  { from: /\bbg-emerald-700\b/g, to: 'bg-sipentar-green-dark' },
  { from: /\bbg-emerald-50\b/g, to: 'bg-sipentar-green-50' },
  { from: /\bbg-emerald-100\b/g, to: 'bg-sipentar-green-100' },
  { from: /\border-emerald-200\b/g, to: 'border-sipentar-green-100' },
  { from: /\border-emerald-500\b/g, to: 'border-sipentar-green' },
  { from: /\bring-emerald-500\b/g, to: 'ring-sipentar-green' },
  { from: /\bfrom-blue-700\b/g, to: 'from-sipentar-blue-dark' },
  { from: /\bto-blue-500\b/g, to: 'to-sipentar-blue' },
  { from: /\bgreens-50\b/g, to: 'sipentar-green-50' },
  { from: /\bgreen-700\b/g, to: 'sipentar-green-dark' },
  { from: /\bgreen-200\b/g, to: 'sipentar-green-100' },
  { from: /\bgreens-50\b/g, to: 'sipentar-green-50' },
];

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const {from, to} of replacements) {
        if (from.test(content)) {
          content = content.replace(from, to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(dir);
console.log('Done.');
