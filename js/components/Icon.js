import { ICONS } from '../icons/svg.js';

export function Icon(name, { size = 20, label = null, className = '' } = {}) {
  const span = document.createElement('span');
  span.className = `icon ${className}`.trim();
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;
  span.style.display = 'inline-flex';
  span.innerHTML = ICONS[name] || '';
  const svgEl = span.querySelector('svg');
  if (svgEl) {
    svgEl.style.width = '100%';
    svgEl.style.height = '100%';
  }
  if (label) {
    span.setAttribute('role', 'img');
    span.setAttribute('aria-label', label);
  }
  return span;
}
