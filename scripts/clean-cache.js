const fs = require('fs');
const path = require('path');

const target = process.argv[2] === 'all' ? '.next' : '.next/cache';
const dirPath = path.join(process.cwd(), target);

if (fs.existsSync(dirPath)) {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`[Clean Cache] Successfully removed: ${target}`);
  } catch (err) {
    console.warn(`[Clean Cache] Warning: Could not clear ${target} (${err.message}). This can happen if the server is actively running.`);
  }
}
