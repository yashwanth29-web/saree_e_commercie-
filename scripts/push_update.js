const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  try {
    const output = execSync(cmd, { stdio: 'pipe' }).toString();
    console.log(output);
  } catch (err) {
    if (err.stdout) console.log(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    throw err;
  }
}

try {
  run('git add -A');
  try {
    run('git commit -m "Fix product recommendations navigation and link authentic DL Handlooms sarees"');
  } catch (e) {
    console.log('Nothing to commit or already committed.');
  }
  console.log('Pushing to origin main...');
  run('git push origin main');
  console.log('Successfully pushed to GitHub main branch!');
} catch (err) {
  console.error('Push failed:', err.message);
  process.exit(1);
}
