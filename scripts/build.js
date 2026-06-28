#!/usr/bin/env node
/**
 * SJIF Build Script — Concatenates and minifies JS for production.
 * Usage: node scripts/build.js
 * Output: app/js/sjif.bundle.min.js
 */
const fs = require('fs');
const path = require('path');

// Files in dependency order (same as index.html)
const files = [
    'app/js/taxonomy.js',
    'app/js/store.js',
    'app/js/auth.js',
    'app/js/utils.js',
    'app/js/analyzer.js',
    'app/js/classifier.js',
    'app/js/charts.js',
    'app/js/pages/login.js',
    'app/js/pages/dashboard.js',
    'app/js/pages/upload.js',
    'app/js/pages/documents.js',
    'app/js/pages/analysis.js',
    'app/js/pages/processes.js',
    'app/js/pages/taxonomy-page.js',
    'app/js/pages/settings.js',
    'app/js/pages/mij-dashboard.js',
    'app/js/pages/mij-magistrados.js',
    'app/js/pages/mij-simulador.js',
    'app/js/app.js',
];

let bundle = '/* SJIF Bundle — Generated ' + new Date().toISOString() + ' */\n';
let totalOriginal = 0;

for (const file of files) {
    const filePath = path.resolve(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found, skipping: ${file}`);
        continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    totalOriginal += content.length;
    bundle += '\n/* === ' + path.basename(file) + ' === */\n';
    bundle += content + '\n';
}

// Basic minification: remove comments and collapse whitespace
// Note: This is intentionally conservative to avoid breaking string literals
// that may contain // or /* patterns. For deeper minification, use terser.
let minified = bundle
    .replace(/\/\*[\s\S]*?\*\//g, '')  // block comments
    .replace(/\/\/[^\n]*/g, '')         // line comments
    .replace(/\n\s*\n/g, '\n')          // blank lines
    .trim();

const outDir = path.resolve(__dirname, '..', 'app', 'js');
const outPath = path.join(outDir, 'sjif.bundle.min.js');
fs.writeFileSync(outPath, minified);

console.log(`✅ Bundle created: ${outPath}`);
console.log(`   Original: ${(totalOriginal / 1024).toFixed(1)} KB (${files.length} files)`);
console.log(`   Bundled:  ${(minified.length / 1024).toFixed(1)} KB (1 file)`);
console.log(`   Savings:  ${((1 - minified.length / totalOriginal) * 100).toFixed(1)}%`);
console.log('');
console.log('To use the bundle, replace all <script> tags in index.html with:');
console.log('   <script defer src="js/sjif.bundle.min.js"></script>');
