const fs = require('fs');
const content = fs.readFileSync('app/admin/students/page.tsx', 'utf8');

const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('editingResult') || line.includes('handleSaveResult') || line.includes('updateTestResult')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
