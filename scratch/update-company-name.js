/**
 * update-company-name.js
 *
 * 1. Replaces all literal "IQ Intern Vocational Training ..." strings with "AVADS Private Limited"
 *    across all HTML templates in public/templates/default/
 * 2. In certificate.html specifically:
 *    - Changes "Verification Code" label → "Company CIN"
 *    - Replaces {{VERIFICATION_CODE}} placeholder → static CIN number U85500BR2025PTC076013
 * 3. Then syncs the updated files to Supabase document_templates table.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ── Load env ──────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*?)?\s*$/);
  if (match) {
    let value = (match[2] || '').trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Config ────────────────────────────────────────────────────────────────────
const TEMPLATES_DIR = path.join(__dirname, '..', 'public', 'templates', 'default');
const COMPANY_CIN   = 'U85500BR2025PTC076013';

// Supabase codes to re-sync after edits (only the ones with DB rows)
const DB_TEMPLATE_CODES = {
  'certificate.html':    'certificate',
  'offer_letter.html':   'offer_letter',
  'attendance_sheet.html': 'attendance_sheet',
  'marksheet.html':      'marksheet',
};

// ── Replacements applied to EVERY HTML file ───────────────────────────────────
const GLOBAL_REPLACEMENTS = [
  // Long-form matches first (most specific)
  ['IQ Intern Vocational Training Platform', 'AVADS Private Limited'],
  ['IQ Intern Vocational Training platform', 'AVADS Private Limited'],
  ['IQIntern Vocational Training Pvt. Ltd.', 'AVADS Private Limited'],
  ['Vocational Training Platform',           'AVADS Private Limited'],
  ['Vocational Skill Development Partner',   'AVADS Private Limited'],
  ['IQIntern Assessment Fee',                'AVADS Assessment Fee'],
];

// ── Replacements applied ONLY to certificate.html ────────────────────────────
const CERT_REPLACEMENTS = [
  ['<span class="verify-label">Verification Code</span>',
   '<span class="verify-label">Company CIN</span>'],
  ['<span class="verify-value">{{VERIFICATION_CODE}}</span>',
   `<span class="verify-value">${COMPANY_CIN}</span>`],
];

// ── Helper ────────────────────────────────────────────────────────────────────
function applyReplacements(content, pairs) {
  let out = content;
  for (const [from, to] of pairs) {
    // Replace ALL occurrences (global string replace)
    while (out.includes(from)) {
      out = out.split(from).join(to);
    }
  }
  return out;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  const files = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith('.html'));
  console.log(`Found ${files.length} HTML templates.\n`);

  for (const file of files) {
    const filePath = path.join(TEMPLATES_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Apply global replacements to every file
    content = applyReplacements(content, GLOBAL_REPLACEMENTS);

    // Apply cert-specific replacements only to certificate.html
    if (file === 'certificate.html') {
      content = applyReplacements(content, CERT_REPLACEMENTS);
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅  Updated: ${file} (${content.length} bytes)`);
    } else {
      console.log(`—   No changes: ${file}`);
    }
  }

  // ── Sync changed DB templates to Supabase ─────────────────────────────────
  console.log('\nSyncing DB-backed templates to Supabase...\n');

  for (const [file, code] of Object.entries(DB_TEMPLATE_CODES)) {
    const filePath = path.join(TEMPLATES_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`  SKIP ${code}: file not found`);
      continue;
    }
    const htmlContent = fs.readFileSync(filePath, 'utf8');

    const { data: rows, error: selErr } = await supabase
      .from('document_templates')
      .select('id')
      .eq('code', code);

    if (selErr) {
      console.error(`  ERROR selecting ${code}:`, selErr.message);
      continue;
    }

    if (rows && rows.length > 0) {
      for (const row of rows) {
        const { error: updErr } = await supabase
          .from('document_templates')
          .update({ html_content: htmlContent, updated_at: new Date().toISOString() })
          .eq('id', row.id);

        if (updErr) {
          console.error(`  ERROR updating ${code} (row ${row.id}):`, updErr.message);
        } else {
          console.log(`  ✅  Supabase updated: ${code} (row ${row.id})`);
        }
      }
    } else {
      console.log(`  ℹ️  No DB row for ${code} — skipping Supabase sync`);
    }
  }

  console.log('\n✨  Done!');
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
