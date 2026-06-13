/* Shared site behaviour */
(function(){
  // Mobile menu toggle
  document.addEventListener('click', function(e){
    var b = e.target.closest('.nav-burger');
    if(b){
      var m = document.querySelector('.nav-mobile');
      if(m) m.classList.toggle('open');
    }
  });
  // Footer year
  document.querySelectorAll('[data-year]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });
})();
