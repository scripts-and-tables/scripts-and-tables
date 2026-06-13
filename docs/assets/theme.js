document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var current = document.documentElement.dataset.theme;
    var next = current === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  });
});
