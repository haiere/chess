/* Build: copies the static web app into dist/ (Capacitor webDir).
   No bundler — the app is vanilla JS. Also vendors the Capacitor
   StatusBar plugin ESM into dist/vendor/ with its bare import of
   '@capacitor/core' rewritten to a relative path. */
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const f of ['index.html', 'style.css']) {
    cpSync(join(root, f), join(dist, f));
}
for (const d of ['js', 'locales']) {
    cpSync(join(root, d), join(dist, d), { recursive: true });
}

const vendor = join(dist, 'vendor');
mkdirSync(vendor, { recursive: true });
const corePkg = join(root, 'node_modules', '@capacitor', 'core');
const sbPkg = join(root, 'node_modules', '@capacitor', 'status-bar');
if (existsSync(corePkg) && existsSync(sbPkg)) {
    cpSync(join(corePkg, 'dist'), join(vendor, 'core'), { recursive: true });
    const sbDir = join(vendor, 'status-bar');
    cpSync(join(sbPkg, 'dist', 'esm'), sbDir, { recursive: true });
    const walk = (dir) => {
        for (const f of readdirSync(dir)) {
            const p = join(dir, f);
            if (statSync(p).isDirectory()) walk(p);
            else if (p.endsWith('.js')) {
                let code = readFileSync(p, 'utf8');
                code = code.replace(/from\s+['"]@capacitor\/core['"]/g, "from '../core/index.js'");
                writeFileSync(p, code);
            }
        }
    };
    walk(sbDir);
    console.log('vendored capacitor plugins into dist/vendor/');
}
console.log('dist/ ready');
