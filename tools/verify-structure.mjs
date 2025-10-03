#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from 'fs';
import { join, extname } from 'path';

const ROOT = 'src';
const ALLOWED = new Set([
  'design-system','widgets','hooks','lib','features','pages','store','styles','stories'
]);
const TOKEN_DIR = 'src/design-system/tokens';
const HEX = /#[0-9A-Fa-f]{3,8}\b/;

let errors = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (dir === ROOT && !ALLOWED.has(name)) {
        errors.push(`Disallowed top-level dir: ${p}`);
      }
      walk(p);
    } else {
      if (HEX.test(readFileSync(p, 'utf8')) && !p.startsWith(TOKEN_DIR)) {
        errors.push(`Hex literal outside tokens: ${p}`);
      }
    }
  }
}
walk(ROOT);

// Duplicate component/widget names across folders
const seen = new Map();
function collect(dir, key) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    if (name.isDirectory()) collect(join(dir, name.name), key);
    else if (/\.(jsx?|tsx?)$/.test(name.name)) {
      const base = name.name.replace(/\.(jsx?|tsx?)$/, '');
      // Skip common index files and barrel exports
      if (base === 'index') continue;
      const list = seen.get(base) || [];
      list.push(join(dir, name.name));
      seen.set(base, list);
    }
  }
}
collect('src/design-system/components','comp');
collect('src/widgets','widget');
for (const [base, files] of seen) {
  const inDS = files.some(f => f.includes('design-system/components'));
  const inWidgets = files.some(f => f.includes('widgets/'));
  if (inDS && inWidgets && files.length > 1) {
    errors.push(`Duplicate name across DS and widgets: ${base}\n  ${files.join('\n  ')}`);
  }
}

if (errors.length) {
  console.error('Structure verification failed:\n' + errors.map(e=>'- '+e).join('\n'));
  process.exit(1);
}
console.log('✅ Structure OK');