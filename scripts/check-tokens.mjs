import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
const SKIP_DIRS = new Set(['node_modules', '.next']);
const IGNORE_MARK = 'check-tokens-ignore';

const RULES = [
  [
    'palette',
    /\b(?:[\w-]+:)*(?:bg|text|border(?:-[trblxy])?|ring(?:-offset)?|outline|divide|from|via|to|fill|stroke|placeholder|caret|accent|decoration|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|[1-9]00|950)(?:\/\d{1,3})?\b/g,
  ],
  [
    'bw',
    /\b(?:[\w-]+:)*(?:bg|text|border|ring(?:-offset)?|from|via|to|fill|stroke|divide|outline|shadow)-(?:white|black)(?:\/\d{1,3})?\b/g,
  ],
  [
    'named',
    /\b(?:fill|stroke|color|background(?:-color)?)\s*[:=]\s*["']?(?:white|black|red|blue|green|yellow|orange|purple|pink|gray|grey)\b/g,
  ],
  ['hex', /(?<![\w&/])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g],
  ['fn', /\b(?:rgba?|hsla?|oklch)\(/g],
  ['arbitrary', /-\[(?:#|rgb|hsl)/g],
];

function fail(message) {
  console.error(message);
  process.exit(2);
}

function isSkippedPath(path) {
  const norm = resolve(path).split(sep).join('/');
  return norm.includes('/app/styles/themes/') || norm.endsWith('/app/styles/bridge.css');
}

function collectFiles(path, out) {
  let stats;
  try {
    stats = statSync(path);
  } catch {
    fail(`check-tokens: unreadable path: ${path}`);
  }
  if (stats.isDirectory()) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) {
        continue;
      }
      collectFiles(join(path, entry.name), out);
    }
    return;
  }
  const isSupported = EXTENSIONS.has(path.slice(path.lastIndexOf('.')));
  if (stats.isFile() && isSupported && !isSkippedPath(path)) {
    out.push(path);
  }
}

function stripBlockComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function stripLineComment(line) {
  return line.replace(/(^|\s)\/\/.*$/, (m, prefix) => prefix + ' '.repeat(m.length - prefix.length));
}

function maskVarRefs(line) {
  return line.replace(/var\(--[^)]*\)/g, (m) => ' '.repeat(m.length));
}

function isHexExempt(line, index) {
  const before = line.slice(0, index);
  return /(?:href=["']?|url\(["']?)$/.test(before);
}

function scanLine(line, lineNo, file, out) {
  for (const [rule, pattern] of RULES) {
    for (const m of line.matchAll(pattern)) {
      if (rule === 'hex' && isHexExempt(line, m.index)) {
        continue;
      }
      out.push({ file, lineNo, col: m.index + 1, rule, match: m[0] });
    }
  }
}

function scanFile(file, out) {
  const raw = readFileSync(file, 'utf8').split('\n');
  const stripped = stripBlockComments(raw.join('\n')).split('\n');
  stripped.forEach((text, i) => {
    const ignored =
      raw[i].includes(IGNORE_MARK) || (i > 0 && raw[i - 1].includes(IGNORE_MARK));
    if (ignored) {
      return;
    }
    const code = maskVarRefs(stripLineComment(text));
    scanLine(code, i + 1, file, out);
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    fail('usage: node scripts/check-tokens.mjs <paths...>');
  }
  const files = [];
  for (const arg of args) {
    collectFiles(arg, files);
  }
  const violations = [];
  for (const file of files) {
    scanFile(file, violations);
  }
  for (const v of violations) {
    console.log(`${v.file}:${v.lineNo}:${v.col}  ${v.rule}  ${v.match}`);
  }
  console.log(`${violations.length} violations`);
  process.exitCode = violations.length === 0 ? 0 : 1;
}

main();
