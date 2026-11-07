import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const THEME_FILES = {
  'buku-tulis': 'app/styles/themes/buku-tulis.css',
  'papan-kapur': 'app/styles/themes/papan-kapur.css',
};
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const RAMP_SHADES = [400, 500, 600, 700, 800, 900, 950];
const PAIRS = [
  ['ink', 'paper', 4.5], ['ink-soft', 'paper', 4.5], ['ink', 'card', 4.5],
  ['ink-soft', 'card', 4.5], ['ink-soft', 'paper-deep', 4.5], ['accent', 'paper', 4.5],
  ['accent', 'card', 4.5], ['on-accent', 'accent', 4.5], ['on-accent', 'accent-ink', 4.5],
  ['accent-ink', 'accent-soft', 4.5], ['ink-soft', 'accent-soft', 4.5],
  ['correct', 'correct-soft', 4.5], ['attention', 'attention-soft', 4.5],
  ['wrong', 'wrong-soft', 4.5], ['accent-ink', 'mark-soft', 4.5], ['ink', 'mark', 4.5],
  ['ink', 'mark-soft', 4.5], ['illus-on-mark', 'illus-mark', 4.5],
  ['focus-ring', 'paper', 3], ['edge', 'paper', 3], ['edge', 'card', 3], ['accent', 'line', 3],
];

const failures = [];
const observed = [];

function parseTokens(css, theme) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = new Map();
  for (const m of clean.matchAll(/--(theme|ramp)-([\w-]+)\s*:\s*([^;]+);/g)) {
    const key = `${m[1]}-${m[2]}`;
    if (tokens.has(key)) {
      console.log(`WARN dup ${key} (${theme})`);
    }
    tokens.set(key, m[3].trim());
  }
  return tokens;
}

function parseHex(value) {
  const m = /^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.exec(value);
  if (!m) {
    return null;
  }
  let hex = m[1];
  if (hex.length <= 4) {
    hex = [...hex].map((c) => c + c).join('');
  }
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
  return { rgb, alpha };
}

function resolveColor(tokens, key, depth = 0) {
  if (depth > 5 || !tokens.has(key)) {
    return null;
  }
  const raw = tokens.get(key);
  const ref = /^var\(--(theme-[\w-]+)\)$/.exec(raw);
  return ref ? resolveColor(tokens, ref[1], depth + 1) : parseHex(raw);
}

function luminance({ rgb }) {
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

function keyOf(name) {
  return name.startsWith('ramp-') ? name : `theme-${name}`;
}

function checkPair(theme, tokens, fgName, bgName, min) {
  const label = `${fgName}/${bgName}`;
  const fg = resolveColor(tokens, keyOf(fgName));
  const bg = resolveColor(tokens, keyOf(bgName));
  if (!fg || !bg) {
    failures.push(`FAIL ${theme} ${label} unresolved`);
    return;
  }
  if (fg.alpha < 1 || bg.alpha < 1) {
    failures.push(`FAIL ${theme} ${label} not opaque`);
    return;
  }
  const ratio = contrast(fg, bg);
  if (min === 4.5) {
    observed.push(ratio);
  }
  if (ratio < min) {
    failures.push(`FAIL ${theme} ${label} ${ratio.toFixed(2)} < ${min}`);
  }
}

function rampNames(tokens) {
  const names = new Set();
  for (const key of tokens.keys()) {
    const m = /^ramp-(.+)-(\d+)$/.exec(key);
    if (m) {
      names.add(m[1]);
    }
  }
  return [...names];
}

function checkRamps(theme, tokens) {
  for (const name of rampNames(tokens).filter((n) => n !== 'inverse')) {
    for (const s of RAMP_SHADES) {
      const fg = `ramp-${name}-${s}`;
      for (const bg of ['card', 'paper', `ramp-${name}-50`, `ramp-${name}-100`]) {
        checkPair(theme, tokens, fg, bg, 4.5);
      }
    }
  }
  for (const s of [400, 500]) {
    for (const b of [800, 900]) {
      checkPair(theme, tokens, `ramp-inverse-${s}`, `ramp-inverse-${b}`, 4.5);
    }
  }
}

function checkKeySets(tokensByTheme) {
  const themes = Object.keys(tokensByTheme);
  for (const prefix of ['theme-', 'ramp-']) {
    const union = new Set(
      themes.flatMap((t) => [...tokensByTheme[t].keys()]).filter((k) => k.startsWith(prefix)),
    );
    for (const t of themes) {
      for (const k of union) {
        if (!tokensByTheme[t].has(k)) {
          failures.push(`FAIL ${t} missing ${k}`);
        }
      }
    }
  }
}

function checkRampShades(theme, tokens) {
  for (const name of rampNames(tokens)) {
    for (const shade of SHADES) {
      if (!tokens.has(`ramp-${name}-${shade}`)) {
        failures.push(`FAIL ${theme} missing ramp-${name}-${shade}`);
      }
    }
  }
}

function checkImportOrder() {
  const css = readFileSync(resolve(ROOT, 'app/globals.css'), 'utf8');
  const buku = css.indexOf('buku-tulis.css');
  const papan = css.indexOf('papan-kapur.css');
  if (buku < 0 || papan < 0 || buku > papan) {
    failures.push('FAIL globals.css buku-tulis must be imported before papan-kapur');
  }
}

function main() {
  const tokensByTheme = {};
  for (const [theme, rel] of Object.entries(THEME_FILES)) {
    tokensByTheme[theme] = parseTokens(readFileSync(resolve(ROOT, rel), 'utf8'), theme);
  }

  checkKeySets(tokensByTheme);
  checkImportOrder();
  for (const [theme, tokens] of Object.entries(tokensByTheme)) {
    checkRampShades(theme, tokens);
    for (const [fg, bg, min] of PAIRS) {
      checkPair(theme, tokens, fg, bg, min);
    }
    checkRamps(theme, tokens);
  }

  if (failures.length > 0) {
    failures.forEach((line) => console.log(line));
    process.exitCode = 1;
    return;
  }

  const themeCount = [...tokensByTheme['buku-tulis'].keys()].filter((k) =>
    k.startsWith('theme-'),
  ).length;
  const min = Math.min(...observed).toFixed(2);
  console.log(
    `OK: ${Object.keys(THEME_FILES).length} themes, ${themeCount} tokens each, min contrast ${min}:1`,
  );
}

main();
