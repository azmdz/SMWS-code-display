const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST = path.join(__dirname, 'dist');
const OUT = path.join(DIST, 'smws-extension.zip');

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const version = pkg.version;

if (fs.existsSync(OUT)) fs.unlinkSync(OUT);

execSync(`zip -r "${OUT}" . --exclude "*.zip"`, { cwd: DIST, stdio: 'inherit' });

console.log(`\nBuilt v${version} → dist/smws-extension.zip`);
