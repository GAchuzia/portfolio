(function () {
  const path = window.location.pathname.replace(/^\//, '') || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function (a) {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();

(function () {
  const el = document.getElementById('random-quote');
  if (!el) return;
  const base = window.location.pathname.indexOf('blog/') !== -1 ? '../' : '';
  fetch(base + 'assets/quotes.txt')
    .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
    .then(function (text) {
      const lines = text.split('\n').map(function (line) {
        return line.replace(/^\s*"?|"?\s*$/g, '').trim();
      }).filter(Boolean);
      if (lines.length) {
        el.textContent = '"' + lines[Math.floor(Math.random() * lines.length)] + '"';
      }
    })
    .catch(function () { el.textContent = ''; });
})();
