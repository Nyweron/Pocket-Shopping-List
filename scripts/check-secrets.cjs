#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const IGNORE_DIRS = new Set([
  '.git',
  '.angular',
  'node_modules',
  'dist',
  'coverage',
  'android/.gradle',
  '.cursor',
  'test-results',
  'playwright-report',
]);

const IGNORE_FILE_EXT = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.pdf',
  '.zip',
  '.jar',
  '.keystore',
  '.jks',
  '.apk',
  '.aab',
]);

const BLOCKED_FILE_NAMES = new Set([
  'google-services.json',
  'GoogleService-Info.plist',
  'serviceAccountKey.json',
]);

const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  /AKIA[0-9A-Z]{16}/g,
  /AIza[0-9A-Za-z\-_]{35}/g,
  /xox[baprs]-[0-9A-Za-z-]{10,}/g,
  /ghp_[0-9A-Za-z]{30,}/g,
  /firebase-adminsdk-[a-z0-9-]+\.json/gi,
];

const violations = [];

function shouldIgnoreDir(absPath) {
  const rel = path.relative(ROOT, absPath).replace(/\\/g, '/');
  return [...IGNORE_DIRS].some((d) => rel === d || rel.startsWith(`${d}/`));
}

function walk(absDir) {
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  for (const entry of entries) {
    const absPath = path.join(absDir, entry.name);
    if (entry.isDirectory()) {
      if (!shouldIgnoreDir(absPath)) {
        walk(absPath);
      }
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (IGNORE_FILE_EXT.has(ext)) continue;
    const rel = path.relative(ROOT, absPath).replace(/\\/g, '/');

    if (BLOCKED_FILE_NAMES.has(entry.name)) {
      violations.push(`[blocked-file] ${rel}`);
      continue;
    }

    let raw = '';
    try {
      raw = fs.readFileSync(absPath, 'utf8');
    } catch {
      continue;
    }
    for (const pattern of SECRET_PATTERNS) {
      pattern.lastIndex = 0;
      if (pattern.test(raw)) {
        violations.push(`[secret-pattern] ${rel} matched ${pattern}`);
        break;
      }
    }
  }
}

walk(ROOT);

if (violations.length > 0) {
  console.error('\nSecret scan FAILED. Remove sensitive data before committing:\n');
  for (const v of violations) console.error(`- ${v}`);
  process.exit(1);
}

console.log('Secret scan passed.');
