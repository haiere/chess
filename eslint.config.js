// ESLint 9 flat config — Hajir Chess
export default [
  {
    ignores: ["dist/**", "node_modules/**"]
  },
  {
    files: ["js/**/*.js", "tests/**/*.mjs", "scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly", document: "readonly", location: "readonly",
        history: "readonly", localStorage: "readonly", navigator: "readonly",
        console: "readonly", setTimeout: "readonly", clearTimeout: "readonly",
        setInterval: "readonly", clearInterval: "readonly", requestAnimationFrame: "readonly",
        matchMedia: "readonly", CustomEvent: "readonly", MutationObserver: "readonly",
        Node: "readonly", fetch: "readonly", alert: "readonly", confirm: "readonly",
        process: "readonly", __dirname: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none", varsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-dupe-keys": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-case": "error",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-redeclare": "error",
      "no-unreachable": "error",
      "no-useless-escape": "warn",
      "no-extra-semi": "warn"
    }
  }
];
