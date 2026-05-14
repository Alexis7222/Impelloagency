#!/usr/bin/env node

/**
 * Impello Site Patcher
 * Run with: node patch_impello.js <path-to-your-index.html>
 * Example:  node patch_impello.js ./index.html
 *
 * Makes two edits:
 *   1. Section 01 body copy
 *   2. Section 05 founder book paragraph
 */

const fs = require("fs");
const path = require("path");

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node patch_impello.js <path-to-html-file>");
  process.exit(1);
}

const absPath = path.resolve(filePath);

if (!fs.existsSync(absPath)) {
  console.error(`File not found: ${absPath}`);
  process.exit(1);
}

let html = fs.readFileSync(absPath, "utf8");
const original = html;

// ─── EDIT 1: Section 01 · The Problem ────────────────────────────────────────
// Replace the two <p> tags that make up the body copy in section 01.
// The pattern below matches the existing text loosely so minor whitespace
// differences don't break the replace.

const section1Old = `You've gotten this far on referrals and warm intros. The product works. Clients stay. But your pipeline depends on who you know, and that has a ceiling.</p>

            <p>You've probably tried cold outreach yourself. Or hired someone who burned through a list with no system behind it. The result is the same: inconsistent meetings, no pipeline visibility, and a nagging feeling that you're leaving revenue on the table.</p>

            <p>That's the gap we close. Not with tactics — with infrastructure.`;

const section1New = `You've gotten this far on referrals and warm intros and it's evident that your product works. In fact, clients stay! However, your pipeline depends on who you know, and that has a ceiling.</p>

            <p>You've probably tried cold outreach yourself or hired someone who burned through a list with no system behind it. The result ends up the same: inconsistent meetings, no pipeline visibility, and a nagging feeling that you're leaving revenue on the table.</p>

            <p>That's the gap we close with infrastructure.`;

if (html.includes(section1Old)) {
  html = html.replace(section1Old, section1New);
  console.log("✅  Section 01 text updated.");
} else {
  // Fallback: try a trimmed single-line match for minified HTML
  const s1OldMinified = `You've gotten this far on referrals and warm intros. The product works. Clients stay. But your pipeline depends on who you know, and that has a ceiling.`;
  if (html.includes(s1OldMinified)) {
    html = html.replace(
      s1OldMinified,
      `You've gotten this far on referrals and warm intros and it's evident that your product works. In fact, clients stay! However, your pipeline depends on who you know, and that has a ceiling.`
    );
    html = html.replace(
      `You've probably tried cold outreach yourself. Or hired someone who burned through a list with no system behind it. The result is the same: inconsistent meetings, no pipeline visibility, and a nagging feeling that you're leaving revenue on the table.`,
      `You've probably tried cold outreach yourself or hired someone who burned through a list with no system behind it. The result ends up the same: inconsistent meetings, no pipeline visibility, and a nagging feeling that you're leaving revenue on the table.`
    );
    html = html.replace(
      `That's the gap we close. Not with tactics — with infrastructure.`,
      `That's the gap we close with infrastructure.`
    );
    console.log("✅  Section 01 text updated (minified fallback).");
  } else {
    console.warn(
      "⚠️  Section 01: could not find expected text. Check the HTML manually.\n" +
      "    Search for: \"gotten this far on referrals\""
    );
  }
}

// ─── EDIT 2: Section 05 · The Founder ────────────────────────────────────────
// Replace the book-list sentence in the founder bio.

const section5Old = `She picked up Chris Voss's <em>"Never Split the Difference"</em> and didn't stop.`;
const section5New = `She picked up Chris Voss's <em>"Never Split the Difference,"</em> then <em>"The Challenger Sale"</em> as well as <em>"Managing the Sales Pipeline: Building Consistency and Predictability in Sales"</em> and she didn't stop.`;

if (html.includes(section5Old)) {
  html = html.replace(section5Old, section5New);
  console.log("✅  Section 05 founder text updated.");
} else {
  // Try without <em> tags (plain text version)
  const s5OldPlain = `She picked up Chris Voss's "Never Split the Difference" and didn't stop.`;
  const s5NewPlain = `She picked up Chris Voss's "Never Split the Difference," then "The Challenger Sale" as well as "Managing the Sales Pipeline: Building Consistency and Predictability in Sales" and she didn't stop.`;
  if (html.includes(s5OldPlain)) {
    html = html.replace(s5OldPlain, s5NewPlain);
    console.log("✅  Section 05 founder text updated (plain text fallback).");
  } else {
    console.warn(
      "⚠️  Section 05: could not find expected text. Check the HTML manually.\n" +
      "    Search for: \"Never Split the Difference\""
    );
  }
}

// ─── Write output ─────────────────────────────────────────────────────────────
if (html !== original) {
  // Back up original
  const backupPath = absPath + ".bak";
  fs.writeFileSync(backupPath, original, "utf8");
  console.log(`📦  Original backed up to: ${backupPath}`);

  fs.writeFileSync(absPath, html, "utf8");
  console.log(`💾  Patched file saved to:  ${absPath}`);
} else {
  console.log("ℹ️  No changes were written (nothing matched).");
}
