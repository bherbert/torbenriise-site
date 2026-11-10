// Zero-dependency build: src/ → dist/
// - merges main.css + responsive.css into one minified styles.css
// - minifies main.js lightly (comments/whitespace)
// - rewrites index.html to reference the bundled files and collapses whitespace
// - copies assets/
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SRC = 'src';
const DIST = 'dist';

const minCss = (s) => s
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,>])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();

const minJs = (s) => s
  .replace(/^\s*\/\/.*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\n\s*\n/g, '\n')
  .replace(/^\s+/gm, '')
  .trim();

const minHtml = (s) => s
  .replace(/<!--(?!\s*\[if)[\s\S]*?-->/g, '')
  .replace(/>\s+</g, '><')
  .replace(/\s{2,}/g, ' ')
  .trim();

async function copyDir(from, to) {
  await fs.mkdir(to, { recursive: true });
  for (const entry of await fs.readdir(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name), b = path.join(to, entry.name);
    if (entry.isDirectory()) await copyDir(a, b);
    else if (!entry.name.startsWith('.')) await fs.copyFile(a, b);
  }
}

await fs.rm(DIST, { recursive: true, force: true });
await fs.mkdir(path.join(DIST, 'css'), { recursive: true });
await fs.mkdir(path.join(DIST, 'js'), { recursive: true });

const css = (await fs.readFile(`${SRC}/css/main.css`, 'utf8')) + '\n' +
            (await fs.readFile(`${SRC}/css/responsive.css`, 'utf8'));
await fs.writeFile(`${DIST}/css/styles.css`, minCss(css));

await fs.writeFile(`${DIST}/js/main.js`, minJs(await fs.readFile(`${SRC}/js/main.js`, 'utf8')));

let html = await fs.readFile(`${SRC}/index.html`, 'utf8');
html = html
  .replace(/<link rel="stylesheet" href="css\/main\.css">\s*<link rel="stylesheet" href="css\/responsive\.css">/,
           '<link rel="stylesheet" href="css/styles.css">');
// Embed each sample chapter as a <template> so the window works even from file://
let samples = '';
for (const f of (await fs.readdir(`${SRC}/samples`)).filter((f) => f.endsWith('.html')).sort()) {
  const body = (await fs.readFile(`${SRC}/samples/${f}`, 'utf8')).replace(/<!--[\s\S]*?-->/g, '').trim();
  samples += `<template data-sample="${f.slice(0, -5)}">${body}</template>\n`;
}
await fs.writeFile(`${DIST}/index.html`, minHtml(html).replace('</body>', samples + '</body>'));

await copyDir(`${SRC}/assets`, `${DIST}/assets`);
await copyDir(`${SRC}/samples`, `${DIST}/samples`);

const size = async (f) => ((await fs.stat(f)).size / 1024).toFixed(1) + ' KB';
console.log('Built dist/');
for (const f of ['index.html', 'css/styles.css', 'js/main.js'])
  console.log('  ' + f.padEnd(16) + await size(`${DIST}/${f}`));
