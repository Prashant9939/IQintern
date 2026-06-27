const fs = require('fs');
const content = fs.readFileSync('app/student/internships/page.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('eligib') || line.toLowerCase().includes('30') || line.toLowerCase().includes('day') || line.toLowerCase().includes('unlock') || line.toLowerCase().includes('assess')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
