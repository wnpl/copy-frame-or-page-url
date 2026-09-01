#!/usr/bin/env node

// Script to bump version in manifest.json
// Usage: node build-version.js [newVersion]
// Example: node build-version.js 1.5.1

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const newVersion = process.argv[2];

if (!newVersion) {
    console.error('Please provide a version number');
    console.log('Usage: node build-version.js <version>');
    console.log('Example: node build-version.js 1.5.1');
    process.exit(1);
}

// Validate version format (simple check)
if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
    console.error('Invalid version format. Use X.Y.Z (e.g., 1.5.1)');
    process.exit(1);
}

manifest.version = newVersion;

// Update package.json version too
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
packageJson.version = newVersion;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`✅ Version updated to ${newVersion}`);
console.log('  - manifest.json');
console.log('  - package.json');
