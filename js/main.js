// main JS for interactivity
document.addEventListener('DOMContentLoaded',function(){
  // year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  navToggle.addEventListener('click',()=>{
    siteNav.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth'});
        if(siteNav.classList.contains('open')) siteNav.classList.remove('open');
      }
    })
  });

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

  function setActiveLink(){
    const fromTop = window.scrollY + 120;
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      if(sectionTop <= fromTop && sectionBottom > fromTop){
        currentId = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      if(link.getAttribute('href') === `#${currentId}`){
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  // contact form basic handling
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    formMsg.textContent='';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    if(!name || !email){
      formMsg.textContent = 'Bitte Namen und E-Mail ausfüllen.';
      return;
    }
    // Simuliere Senden (kein Backend)
    form.querySelector('button[type="submit"]').disabled = true;
    formMsg.textContent = 'Anfrage wird gesendet...';
    setTimeout(()=>{
      formMsg.textContent = 'Danke! Deine Anfrage wurde empfangen. Wir melden uns in Kürze.';
      form.reset();
      form.querySelector('button[type="submit"]').disabled = false;
    },1200);
  });
});
