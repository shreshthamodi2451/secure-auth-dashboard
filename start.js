/**
 * SecureAuth App Concurrent Runner
 * Launches both Backend (port 5000) and Frontend (port 3000) in a single command.
 */
const { spawn } = require('child_process');
const path = require('path');

console.log('==================================================');
console.log('🚀 Launching SecureAuth Full-Stack Application...');
console.log('==================================================\n');

// Helper to spawn processes with styled console logs
function startService(name, dir, command, args) {
  const proc = spawn(command, args, { 
    cwd: path.join(__dirname, dir), 
    shell: true 
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.log(`[\x1b[36m${name}\x1b[0m] ${line}`);
    });
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      console.error(`[\x1b[31m${name}-ERROR\x1b[0m] ${line}`);
    });
  });

  proc.on('close', (code) => {
    console.log(`[\x1b[33m${name}\x1b[0m] Exited with code ${code}`);
  });

  return proc;
}

// 1. Launch Express backend on port 5000
const backend = startService('Backend', 'backend', 'npm', ['run', 'dev']);

// 2. Launch Next.js frontend on port 3000
const frontend = startService('Frontend', 'frontend', 'npm', ['run', 'dev']);

// Securely close both processes when you press Ctrl+C in VS Code terminal
process.on('SIGINT', () => {
  console.log('\nStopping all SecureAuth servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});