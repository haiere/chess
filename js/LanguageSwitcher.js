/**
 * LanguageSwitcher — komponen select bahasa aksesibel.
 * Render ke elemen target, sinkron dengan I18n.
 *
 * Penggunaan:
 *   LanguageSwitcher.mount(document.getElementById("lang-slot"));
 */
(function (global) {
  "use strict";

  function createOption(value, label) {
    var opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    return opt;
  }

  var LanguageSwitcher = {
    mount: function (container) {
      if (!container) return null;
      if (!global.I18n) {
        if (global.console) console.warn("[LanguageSwitcher] I18n belum siap");
        return null;
      }

      // Hindari duplikasi jika dipanggil ulang
      container.innerHTML = "";

      var wrapper = document.createElement("div");
      wrapper.className = "lang-switcher";

      var label = document.createElement("label");
      label.className = "lang-switcher__label";
      label.setAttribute("for", "lang-select");
      label.setAttribute("data-i18n", "settings.language");

      var select = document.createElement("select");
      select.id = "lang-select";
      select.className = "lang-switcher__select";
      select.setAttribute("aria-label", global.I18n.t("a11y.languageSwitcher"));

      var langs = global.I18n.getAvailable();
      for (var i = 0; i < langs.length; i++) {
        var code = langs[i];
        var labelKey = code === "id" ? "settings.indonesian" : "settings.english";
        select.appendChild(createOption(code, global.I18n.t(labelKey)));
      }
      select.value = global.I18n.getLang();

      select.addEventListener("change", function (e) {
        global.I18n.setLang(e.target.value);
      });

      wrapper.appendChild(label);
      wrapper.appendChild(select);
      container.appendChild(wrapper);

      // Sinkron ulang jika bahasa berubah dari tempat lain
      global.I18n.onChange(function (lang) {
        if (select.value !== lang) select.value = lang;
        select.setAttribute("aria-label", global.I18n.t("a11y.languageSwitcher"));
        var opts = select.options;
        for (var j = 0; j < opts.length; j++) {
          var key = opts[j].value === "id" ? "settings.indonesian" : "settings.english";
          opts[j].textContent = global.I18n.t(key);
        }
      });

      // Isi label setelah ada di DOM
      global.I18n.applyToDOM(wrapper);

      return wrapper;
    }
  };

  global.LanguageSwitcher = LanguageSwitcher;
})(typeof window !== "undefined" ? window : this);
