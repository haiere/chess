(function() {
  function initSettings() {
    const page = document.getElementById('page-settings');
    if (!page || page.querySelector('.custom-lang-switcher')) return;

    const card = document.createElement('div');
    card.className = 'card custom-lang-switcher';
    card.innerHTML = `
      <label for="lang-select" style="display:block;margin-bottom:8px;font-weight:600;">
        ${window.I18n.t('settings.language')}
      </label>
      <select id="lang-select" class="btn" style="width:100%;">
        <option value="id">Bahasa Indonesia</option>
        <option value="en">English</option>
      </select>
      <p style="font-size:12px;margin-top:8px;color:var(--text-muted);">
        ${window.I18n.t('settings.languageDescription')}
      </p>
    `;
    page.appendChild(card);

    const select = card.querySelector('#lang-select');
    select.value = window.I18n.lang;

    select.addEventListener('change', (e) => {
      window.I18n.setLang(e.target.value);
      // Terjemahkan ulang seluruh halaman tanpa reload
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = window.I18n.t(key);
      });
      // Update atribut lang
      document.documentElement.lang = e.target.value;
    });
  }

  // Jalankan saat halaman settings dibuka
  window.addEventListener('hashchange', () => {
    if (location.hash.includes('settings')) initSettings();
  });
  document.addEventListener('DOMContentLoaded', () => {
    if (location.hash.includes('settings')) initSettings();
  });
})();
