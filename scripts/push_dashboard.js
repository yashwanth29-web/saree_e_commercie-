const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  const output = execSync(cmd, { stdio: 'pipe' }).toString();
  console.log(output);
}

try {
  run('git add src/app/admin src/app/api/admin src/app/api/orders/track src/app/track-order src/components/layout');
  run('git commit -m "Add Owner Order Tracking Dashboard and Customer Track Order portal"');
  console.log('Successfully committed!');
  console.log('Now pushing to origin main...');
  run('git push origin main');
  console.log('Successfully pushed to GitHub!');
} catch (err) {
  console.error('Error during git operations:', err.message);
  if (err.stdout) console.log('stdout:', err.stdout.toString());
  if (err.stderr) console.error('stderr:', err.stderr.toString());
  process.exit(1);
}
