/**
 * js/components/LanguageSwitcher.js — ESM.
 * Gunakan window.I18n (yang sudah di-set oleh js/i18n.js).
 */
export const LanguageSwitcher = {
  mount(container) {
    if (!container) return null;
    const I18n = window.I18n;
    if (!I18n) { console.warn("[LanguageSwitcher] I18n belum siap"); return null; }

    container.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "lang-switcher";

    const label = document.createElement("label");
    label.className = "lang-switcher__label";
    label.setAttribute("for", "lang-select");
    label.setAttribute("data-i18n", "settings.language");
    label.textContent = I18n.t("settings.language");

    const select = document.createElement("select");
    select.id = "lang-select";
    select.className = "lang-switcher__select";
    select.setAttribute("aria-label", I18n.t("a11y.languageSwitcher"));

    for (const code of I18n.getAvailable()) {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = I18n.t(code === "id" ? "settings.indonesian" : "settings.english");
      select.appendChild(opt);
    }
    select.value = I18n.getLang();

    select.addEventListener("change", e => I18n.setLang(e.target.value));

    wrap.appendChild(label);
    wrap.appendChild(select);
    container.appendChild(wrap);

    I18n.onChange(lang => {
      if (select.value !== lang) select.value = lang;
      select.setAttribute("aria-label", I18n.t("a11y.languageSwitcher"));
      Array.from(select.options).forEach(o => {
        o.textContent = I18n.t(o.value === "id" ? "settings.indonesian" : "settings.english");
      });
    });

    return wrap;
  }
};

if (typeof window !== "undefined") window.LanguageSwitcher = LanguageSwitcher;
export default LanguageSwitcher;
