/**
 * tests/bridge.test.js
 * Verifikasi kontrak bridge tanpa DOM nyata (mock global).
 * Jalankan: node tests/bridge.test.js
 */
const fs = require("fs");
const path = require("path");

let passed = 0, failed = 0;
function ok(cond, msg) {
  if (cond) { passed++; }
  else { failed++; console.error("  ✗", msg); }
}

// Mock minimal global
const mockGlobal = {
  console: { warn() {}, info() {}, error() {} },
  document: {
    readyState: "complete",
    addEventListener() {},
    getElementById() { return null; },
    querySelectorAll() { return []; },
    documentElement: { setAttribute() {} },
    body: { setAttribute() {}, appendChild() {} }
  },
  navigator: {},
  localStorage: null,
  setTimeout: setTimeout,
  confirm: () => true
};
global.window = mockGlobal;
global.document = mockGlobal.document;
global.navigator = mockGlobal.navigator;

const root = path.resolve(__dirname, "..");

// 1. Semua file bridge ada
const bridgeFiles = [
  "js/bridge/game-bridge.js",
  "js/bridge/puzzle-bridge.js",
  "js/bridge/learn-bridge.js",
  "js/bridge/index.js"
];
bridgeFiles.forEach(f => {
  ok(fs.existsSync(path.join(root, f)), "File bridge hilang: " + f);
});

// 2. Setiap bridge export global
function loadBridge(relPath, expectGlobal) {
  const code = fs.readFileSync(path.join(root, relPath), "utf8");
  try {
    // Jalankan dalam konteks window tiruan
    const fn = new Function("window", "document", "console",
      "navigator", "localStorage", "setTimeout", "confirm",
      code + "\n; return typeof " + expectGlobal + " !== 'undefined' ? " + expectGlobal + " : (window." + expectGlobal + " || null);"
    );
    const result = fn(mockGlobal, mockGlobal.document, mockGlobal.console,
      mockGlobal.navigator, null, setTimeout, () => true);
    ok(!!result, relPath + " tidak mengekspos " + expectGlobal);
    return result;
  } catch (e) {
    ok(false, relPath + " error saat dimuat: " + e.message);
    return null;
  }
}

const GameBridge = loadBridge("js/bridge/game-bridge.js", "GameBridge");
const PuzzleBridge = loadBridge("js/bridge/puzzle-bridge.js", "PuzzleBridge");
const LearnBridge = loadBridge("js/bridge/learn-bridge.js", "LearnBridge");

// 3. Bridge punya init() dan _reset()
[["GameBridge", GameBridge], ["PuzzleBridge", PuzzleBridge], ["LearnBridge", LearnBridge]]
  .forEach(([name, b]) => {
    ok(b && typeof b.init === "function", name + ".init bukan function");
    ok(b && typeof b._reset === "function", name + "._reset bukan function");
  });

// 4. index.js memuat Bridge global
try {
  const idx = fs.readFileSync(path.join(root, "js/bridge/index.js"), "utf8");
  const fn = new Function("window", "document", "console", "navigator",
    "localStorage", "matchMedia", "location", "setTimeout",
    idx + "\n; return window.Bridge;"
  );
  const Bridge = fn(mockGlobal, mockGlobal.document, mockGlobal.console,
    mockGlobal.navigator, null, () => ({ matches: false }),
    { hash: "#game" }, setTimeout);
  ok(Bridge && typeof Bridge.initForRoute === "function",
    "Bridge.initForRoute bukan function");
} catch (e) {
  ok(false, "index.js error: " + e.message);
}

console.log("\n  Passed:", passed, "| Failed:", failed);
process.exit(failed === 0 ? 0 : 1); 
