const fs = require('fs');
const pkg = require('./package.json');
const manifestPath = './theme/manifest.json';

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
manifest.version = pkg.version;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`✅ Sync complete: manifest.json is now v${pkg.version}`);