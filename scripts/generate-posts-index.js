/**
 * Generates posts/index.json from all .md files in posts/.
 * Run from repo root: node scripts/generate-posts-index.js
 *
 * Optional frontmatter in each .md:
 * ---
 * title: My post title
 * date: 2025-03-09
 * excerpt: Short summary for the list.
 * ---
 *
 * If missing, title = first # line, date = file mtime (YYYY-MM-DD), excerpt = first paragraph.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '..', 'posts');
const OUTPUT_FILE = path.join(POSTS_DIR, 'index.json');

const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function parseFrontmatter(content) {
  const match = content.match(frontmatterRegex);
  if (!match) return { body: content, title: null, date: null, excerpt: null };
  const [, fm, body] = match;
  const meta = {};
  fm.split('\n').forEach((line) => {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) meta[m[1].toLowerCase()] = m[2].trim();
  });
  return {
    body,
    title: meta.title || null,
    date: meta.date || null,
    excerpt: meta.excerpt || null,
  };
}

function getTitleFromBody(body) {
  const m = body.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function getExcerptFromBody(body, maxLength = 160) {
  const trimmed = body.trim().replace(/^#.*$/m, '').trim();
  const firstBlock = trimmed.split(/\n\n/)[0] || '';
  const oneLine = firstBlock.replace(/\n/g, ' ').trim();
  if (oneLine.length <= maxLength) return oneLine;
  return oneLine.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

function toISODate(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

if (!fs.existsSync(POSTS_DIR)) {
  console.error('posts/ directory not found');
  process.exit(1);
}

const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
const posts = [];

for (const file of files) {
  const slug = path.basename(file, '.md');
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const stat = fs.statSync(filePath);
  const { body, title: fmTitle, date: fmDate, excerpt: fmExcerpt } = parseFrontmatter(content);

  const title = fmTitle || getTitleFromBody(body) || slug;
  const date = fmDate || toISODate(stat.mtime);
  const excerpt = fmExcerpt || getExcerptFromBody(body);

  posts.push({ slug, title, date, excerpt });
}

posts.sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2), 'utf8');
console.log('Wrote', OUTPUT_FILE, 'with', posts.length, 'posts');
