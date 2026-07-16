const fs = require('fs');
const path = require('path');

const workspaceDir = 'c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern';
const cacheDir = path.join(workspaceDir, 'pdf_cache');
const metaPath = path.join(cacheDir, 'metadata.json');

console.log("--- PURGING REPORTS CACHE ---");

if (fs.existsSync(metaPath)) {
  try {
    const list = JSON.parse(fs.readFileSync(metaPath, 'utf8')) || [];
    const beforeCount = list.length;
    const filtered = list.filter(doc => doc.document_type !== 'project_report' && doc.document_type !== 'internship_report');
    const afterCount = filtered.length;
    
    fs.writeFileSync(metaPath, JSON.stringify(filtered, null, 2), 'utf8');
    console.log(`Successfully removed ${beforeCount - afterCount} report cache entries from metadata.json.`);
  } catch (err) {
    console.error("Error reading/writing metadata.json:", err);
  }
} else {
  console.log("No metadata.json cache index found to purge.");
}

console.log("--- PURGE COMPLETE ---");
