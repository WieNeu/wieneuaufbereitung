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

  const accordionItems = document.querySelectorAll('.accordion-item');

  // smooth scroll for anchor links and open the related accordion section
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if(targetSection){
          const detail = targetSection.querySelector('details');
          if(detail){
            detail.open = true;
            accordionItems.forEach(other => {
              if(other !== detail) other.open = false;
            });
          }
          targetSection.scrollIntoView({behavior:'smooth'});
        }
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

  // ensure only one legal section is opened at a time
  const legalDetails = document.querySelectorAll('.legal-card');
  legalDetails.forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      legalDetails.forEach(other => {
        if (other !== detail) other.open = false;
      });
    });
  });

  // accordion behaviour: only one main section open at a time
  accordionItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      accordionItems.forEach(other => {
        if (other !== item) other.open = false;
      });
    });
  });

  // contact form - WhatsApp integration
  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    formMsg.textContent='';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    
    if(!name || !email){
      formMsg.textContent = 'Bitte Namen und E-Mail ausfüllen.';
      return;
    }
    
    const selectedPackage = form.package ? form.package.value : 'Kein Paket ausgewählt';
    const selectedAddons = Array.from(form.querySelectorAll('input[name="addons"]:checked')).map(input => input.value);
    
    // WhatsApp Nachricht zusammenstellen
    const whatsappMessage = `Hallo, mein Name ist ${name}.\nE-Mail: ${email}\n\nGewünschtes Paket: ${selectedPackage}\nZusatzleistungen: ${selectedAddons.length ? selectedAddons.join(', ') : 'Keine'}\n\nNachricht:\n${message || 'Ich möchte einen Termin anfragen.'}`;
    
    // WhatsApp URL mit kodierter Nachricht
    const whatsappPhone = '4939344993858'; // deine Nummer ohne + oder 0
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Bestätigungsmeldung zeigen
    form.querySelector('button[type="submit"]').disabled = true;
    formMsg.textContent = 'Leite dich zu WhatsApp weiter...';
    
    // Direkt zu WhatsApp weiterleiten
    window.location.href = whatsappUrl;
    form.reset();
    form.querySelector('button[type="submit"]').disabled = false;
  });
});
