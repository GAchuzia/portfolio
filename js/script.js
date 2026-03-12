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
