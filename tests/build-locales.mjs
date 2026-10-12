/* Regenerates js/locales.js from locales/*.json so translations work
   on file:// (fetch of JSON is blocked there) and without async loading.
   Run after editing any locale file: node tests/build-locales.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = {};
for (const l of ['id', 'en']) {
    out[l] = JSON.parse(readFileSync(join(root, 'locales', l + '.json'), 'utf8'));
}
const js = '/* GENERATED FILE — edit locales/*.json then run: node tests/build-locales.mjs */\n' +
           'window.LOCALES = ' + JSON.stringify(out, null, 2) + ';\n';
writeFileSync(join(root, 'js', 'locales.js'), js);
console.log('js/locales.js regenerated (' + Object.keys(out.id).length + ' namespaces, ' +
            Object.keys(out.en).length + ' namespaces)');
