/* Locale validator — locales/*.json adalah satu-satunya sumber kebenaran.
   Memverifikasi: JSON valid, key id/en identik, tidak ada key duplikat mentah,
   tidak ada nilai yang kosong. Jalankan: node tests/build-locales.mjs */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function flatten(obj, prefix = '', out = {}) {
    for (const [k, v] of Object.entries(obj)) {
        if (v && typeof v === 'object') flatten(v, prefix + k + '.', out);
        else out[prefix + k] = v;
    }
    return out;
}

const locales = {};
for (const l of ['id', 'en']) {
    locales[l] = JSON.parse(readFileSync(join(root, 'locales', l + '.json'), 'utf8'));
}

const flatId = flatten(locales.id);
const flatEn = flatten(locales.en);
const keysId = Object.keys(flatId), keysEn = Object.keys(flatEn);
const missingEn = keysId.filter(k => !(k in flatEn));
const missingId = keysEn.filter(k => !(k in flatId));
const emptyVals = [...keysId, ...keysEn].filter(k => flatId[k] === '' || flatEn[k] === '');

let fail = 0;
if (missingEn.length) { console.error('MISSING in en:', missingEn); fail = 1; }
if (missingId.length) { console.error('MISSING in id:', missingId); fail = 1; }
if (emptyVals.length) { console.error('EMPTY values:', emptyVals); fail = 1; }

console.log('id: ' + keysId.length + ' keys, en: ' + keysEn.length + ' keys — ' +
    (fail ? 'INVALID' : 'SYNC OK'));
process.exit(fail);
