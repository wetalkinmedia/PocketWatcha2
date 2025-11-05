const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Creating download package...');

const projectDir = '/tmp/cc-agent/56456849/project';
const outputFile = path.join(projectDir, 'pocketwatcha-project.zip');

try {
  // Use tar instead of zip (more commonly available)
  const tarFile = path.join(projectDir, 'pocketwatcha-project.tar.gz');

  execSync(`tar -czf "${tarFile}" --exclude="node_modules" --exclude=".git" --exclude="*.tar.gz" --exclude="*.zip" --exclude="create-download-package.js" -C "${projectDir}" .`, {
    stdio: 'inherit'
  });

  console.log('\n✅ Package created successfully!');
  console.log(`📦 File location: ${tarFile}`);
  console.log('\nYou can now download this file from your browser.');

} catch (error) {
  console.error('Error creating package:', error.message);
}
