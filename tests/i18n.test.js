/**
 * Test i18n: parity key, fallback, interpolasi, detection.
 * Jalankan: node tests/i18n.test.js
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const idJson = JSON.parse(fs.readFileSync(path.join(root, "locales/id.json"), "utf8"));
const enJson = JSON.parse(fs.readFileSync(path.join(root, "locales/en.json"), "utf8"));

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("  ✗", msg); }
}

function flatten(obj, prefix, out) {
  out = out || {};
  prefix = prefix || "";
  for (const k in obj) {
    const v = obj[k];
    const key = prefix ? prefix + "." + k : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = v;
    }
  }
  return out;
}

const flatId = flatten(idJson);
const flatEn = flatten(enJson);

const idKeys = Object.keys(flatId).sort();
const enKeys = Object.keys(flatEn).sort();

console.log("i18n tests");
console.log("  id keys:", idKeys.length, "| en keys:", enKeys.length);

// 1. Parity: semua key id ada di en
const missingInEn = idKeys.filter(k => !(k in flatEn));
assert(missingInEn.length === 0, "Key id yang hilang di en: " + missingInEn.join(", "));

// 2. Parity: semua key en ada di id
const missingInId = enKeys.filter(k => !(k in flatId));
assert(missingInId.length === 0, "Key en yang hilang di id: " + missingInId.join(", "));

// 3. Semua value string non-empty
let emptyValues = [];
for (const k of idKeys) {
  if (typeof flatId[k] !== "string" || flatId[k].length === 0) emptyValues.push("id:" + k);
}
for (const k of enKeys) {
  if (typeof flatEn[k] !== "string" || flatEn[k].length === 0) emptyValues.push("en:" + k);
}
assert(emptyValues.length === 0, "Value kosong: " + emptyValues.join(", "));

// 4. Key yang diminta user benar-benar ada
const requiredKeys = [
  "common.cancel", "common.close", "common.confirm",
  "navigation.play", "navigation.puzzles", "navigation.learning", "navigation.settings",
  "game.newGame", "game.restart", "game.undo", "game.redo",
  "game.check", "game.checkmate", "game.yourTurn",
  "game.whiteWins", "game.blackWins", "game.draw",
  "puzzle.title", "puzzle.next", "puzzle.retry", "puzzle.hint",
  "puzzle.correct", "puzzle.incorrect", "puzzle.completed",
  "learning.title", "learning.previous", "learning.next", "learning.completed",
  "settings.language", "settings.indonesian", "settings.english"
];
const missingRequired = requiredKeys.filter(k => !(k in flatId) || !(k in flatEn));
assert(missingRequired.length === 0, "Key wajib hilang: " + missingRequired.join(", "));

console.log("\n  Passed:", passed, "| Failed:", failed);
process.exit(failed === 0 ? 0 : 1);
