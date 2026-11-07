import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const SKIP_DIRS = new Set(['node_modules', '.next']);
const PAGE_LIMIT = 150;
const COMPONENT_LIMIT = 200;

function fail(message) {
  console.error(message);
  process.exit(2);
}

function collect(path, files) {
  let stat;
  try {
    stat = statSync(path);
  } catch {
    fail(`cannot read path: ${path}`);
  }
  if (stat.isFile()) {
    if (extname(path) === '.tsx') files.push(path);
    return;
  }
  if (!stat.isDirectory()) return;
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
    collect(join(path, entry.name), files);
  }
}

function countLines(path) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    fail(`cannot read path: ${path}`);
  }
  if (text === '') return 0;
  const lines = text.split(/\r?\n/);
  return text.endsWith('\n') ? lines.length - 1 : lines.length;
}

const args = process.argv.slice(2);
if (args.length === 0) fail('usage: node scripts/check-sizes.mjs <paths...>');

const files = [];
for (const arg of args) collect(arg, files);

let violations = 0;
for (const file of files) {
  const name = basename(file);
  const limit = name === 'page.tsx' || name === 'layout.tsx' ? PAGE_LIMIT : COMPONENT_LIMIT;
  const lines = countLines(file);
  if (lines > limit) {
    violations += 1;
    console.log(`${file}: ${lines} lines (limit ${limit})`);
  }
}

console.log(`${violations} violations`);
process.exit(violations > 0 ? 1 : 0);
