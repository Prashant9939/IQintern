const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('netstat -ano').toString();
  const lines = output.split('\n');
  const pids = new Set();
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 5 && parts[1].endsWith(':3000')) {
      pids.add(parts[4]);
    }
  }
  for (const pid of pids) {
    console.log(`Killing process on port 3000: ${pid}`);
    try {
      execSync(`taskkill /F /PID ${pid}`);
    } catch (err) {
      console.warn(`Could not kill PID ${pid}: ${err.message}`);
    }
  }
} catch (e) {
  console.log('No active process detected on port 3000');
}

const cachePath = '.next';
if (fs.existsSync(cachePath)) {
  console.log('Removing .next cache...');
  try {
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log('Cache directory removed.');
  } catch (err) {
    console.warn(`Could not remove cache directory: ${err.message}`);
  }
}
