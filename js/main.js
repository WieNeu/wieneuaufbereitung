// Wie Neu Autoaufbereitung – Website-Skripte

function initializeApp() {
  const header = document.getElementById('header');
  const businessPhone = '4939344993858';
  const packageLabels = {
    fresh: 'Frisch gemacht',
    care: 'Wieder gepflegt',
    wikeneu: 'Wie Neu',
    showroom: 'Showroom Edition'
  };

  function openWhatsApp(text) {
    const url = `https://wa.me/${businessPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 14) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------- Mobile Navigation ---------- */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  const navLinks = document.querySelectorAll('.site-nav a');

  function openMenu() {
    siteNav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = siteNav.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!siteNav.classList.contains('open')) return;
      if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- Modal Funktionalität ---------- */
  const modals = document.querySelectorAll('.modal');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Modal-Buttons: data-modal & data-close-modal
  document.addEventListener('click', function (e) {
    // Open Modal
    if (e.target.dataset.modal) {
      openModal(e.target.dataset.modal);
    }
    // Close Modal
    if (e.target.dataset.closeModal) {
      closeModal(e.target.dataset.closeModal);
    }
  });

  // Modal Overlay Click schließt Modal
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function () {
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // ESC schließt Modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      modals.forEach(function (modal) {
        if (modal.classList.contains('open')) {
          closeModal(modal.id);
        }
      });
    }
  });

  // Package Pre-Select (wenn von Package Card Buchen-Button geklickt)
  document.querySelectorAll('button[data-select-package]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const packageName = this.dataset.selectPackage;
      setTimeout(function () {
        const radio = document.querySelector(`input[name="package"][value="${packageName}"]`);
        if (radio) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 100);
    });
  });

  // Direkte WhatsApp-Anfrage je Paketkarte
  document.querySelectorAll('[data-whatsapp-package]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const packageId = this.dataset.whatsappPackage;
      const packageName = packageLabels[packageId] || packageId;
      const message = [
        'Hallo Wie Neu Team,',
        '',
        `ich interessiere mich fuer das Paket "${packageName}".`,
        'Ist in den naechsten Tagen ein Termin frei?',
        '',
        'Mein Wunschzeitraum:'
      ].join('\n');

      openWhatsApp(message);
    });
  });

  /* ---------- Booking Form - Preisberechnung ---------- */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    const packageRadios = bookingForm.querySelectorAll('input[name="package"]');
    const extraCheckboxes = bookingForm.querySelectorAll('input[name="extra"]');
    const packagePriceEl = document.getElementById('packagePrice');
    const extrasPriceEl = document.getElementById('extrasPrice');
    const totalPriceEl = document.getElementById('totalPrice');
    const extrasRow = document.getElementById('extrasRow');

    function updatePrice() {
      let packagePrice = 0;
      let originalPackagePrice = 0;
      let extrasPrice = 0;

      // Paket-Preis
      packageRadios.forEach(function (radio) {
        if (radio.checked) {
          packagePrice = parseFloat(radio.dataset.price) || 0;
          originalPackagePrice = parseFloat(radio.dataset.originalPrice) || 0;
        }
      });

      // Zusatzleistungen-Preis
      extraCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          extrasPrice += parseFloat(checkbox.dataset.price) || 0;
        }
      });

      // Rabatt berechnen (20%)
      const discount = (originalPackagePrice * 0.20);
      const totalOriginal = originalPackagePrice + extrasPrice;
      const totalPrice = packagePrice + extrasPrice;

      // Update HTML mit Komma-Formatierung
      const formatPrice = (price) => price.toFixed(2).replace('.', ',') + '€';
      
      document.getElementById('originalPrice').textContent = formatPrice(totalOriginal);
      document.getElementById('discountPrice').textContent = '-' + formatPrice(discount);
      document.getElementById('packagePrice').textContent = formatPrice(packagePrice);
      document.getElementById('extrasPrice').textContent = formatPrice(extrasPrice);
      document.getElementById('totalPrice').textContent = formatPrice(totalPrice);

      // Show/Hide Extras-Zeile
      if (extrasPrice > 0) {
        document.getElementById('extrasRow').style.display = 'flex';
      } else {
        document.getElementById('extrasRow').style.display = 'none';
      }
    }

    // Eventlistener für Preisberechnung
    packageRadios.forEach(function (radio) {
      radio.addEventListener('change', updatePrice);
    });

    extraCheckboxes.forEach(function (checkbox) {
      checkbox.addEventListener('change', updatePrice);
    });

    // Booking Form Submit
    bookingForm.addEventListener('submit', function (e) {
      const agbCheckbox = document.getElementById('accept-agb');
      const privacyCheckbox = document.getElementById('accept-datenschutz');

      if (!bookingForm.checkValidity() || !agbCheckbox.checked || !privacyCheckbox.checked) {
        e.preventDefault();
        alert('Bitte bestätige beide Einwilligungen (AGB und Datenschutz), bevor du deine Anfrage absenden kannst.');
        return;
      }

      e.preventDefault();

      const name = document.getElementById('booking-name').value;
      const email = document.getElementById('booking-email').value;
      const phone = document.getElementById('booking-phone').value;
      const date = document.getElementById('booking-date').value;
      const notes = document.getElementById('booking-notes').value;

      let selectedPackage = '';
      packageRadios.forEach(function (radio) {
        if (radio.checked) selectedPackage = radio.value;
      });

      let selectedExtras = [];
      extraCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) selectedExtras.push(checkbox.value);
      });

      const totalPrice = totalPriceEl.textContent;

      // Nachricht zusammenstellen
      let message = `Buchungsanfrage:\n\n`;
      message += `Name: ${name}\n`;
      message += `Email: ${email}\n`;
      message += `Telefon: ${phone}\n`;
      message += `Wunschdatum: ${date}\n`;
      message += `Paket: ${selectedPackage}\n`;
      if (selectedExtras.length > 0) {
        message += `Zusatzleistungen: ${selectedExtras.join(', ')}\n`;
      }
      message += `Gesamtpreis: ${totalPrice}\n`;
      message += `Ich habe die AGB und die Datenschutzbestimmungen gelesen und akzeptiere sie.\n`;
      if (notes) {
        message += `Notizen: ${notes}\n`;
      }

      // Fallback: Alert mit Info
      alert('Vielen Dank für deine Buchungsanfrage! Wir öffnen WhatsApp, damit wir deinen Termin bestätigen können.');

      // WhatsApp öffnen
      openWhatsApp(message);

      // Form zurücksetzen
      bookingForm.reset();
      updatePrice();

      // Modal schließen
      closeModal('bookingModal');
    });

    // Initial Price Update
    updatePrice();
  }

  /* ---------- Contact Form ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const message = document.getElementById('message').value;

      const contactMessage = [
        'Kontaktanfrage ueber Website',
        '',
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone}`,
        `Nachricht: ${message || 'Keine Zusatznachricht'}`
      ].join('\n');

      alert(`Vielen Dank fuer deine Nachricht, ${name}!\n\nWir oeffnen jetzt WhatsApp fuer die direkte Terminabstimmung.`);
      openWhatsApp(contactMessage);

      contactForm.reset();
    });
  }

  /* ---------- Jahr im Footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Smooth Scroll für Anker-Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && !href.includes('Modal')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Reveal cards and sections once they enter the viewport.
  const revealSelectors = [
    '.section-header',
    '.feature-card',
    '.service-card',
    '.package-card',
    '.team-card',
    '.testimonial-card',
    '.gallery-card',
    '.car-showcase',
    '.car-shot',
    '.contact-block',
    '.step'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(','));
  revealElements.forEach(function (element) {
    element.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    });

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add('is-visible');
    });
  }

  const servicesWrapper = document.querySelector('.additional-services');
  const servicesToggle = document.querySelector('.additional-services .review-toggle');

  if (servicesWrapper && servicesToggle) {
    servicesToggle.addEventListener('click', function (e) {
      e.preventDefault();
      servicesWrapper.classList.toggle('open');
      const isOpen = servicesWrapper.classList.contains('open');
      servicesToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Collapsible per-vehicle showcase blocks.
  document.querySelectorAll('.car-showcase').forEach(function (showcase) {
    const toggle = showcase.querySelector('.car-showcase-toggle');
    const icon = showcase.querySelector('.car-showcase-toggle-icon');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      showcase.classList.toggle('open');
      const isOpen = showcase.classList.contains('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (icon) {
        icon.textContent = isOpen ? '−' : '+';
      }
    });
  });

  /* ---------- Google Reviews Widget Loader ---------- */
  // Lade Google Reviews Widget asynchron
  const testimonialsGrid = document.getElementById('testimonials-grid');
  
  if (testimonialsGrid) {
    // Lade Google Review Badge mit Verzögerung
    setTimeout(function() {
      // Google Review Badge Script laden
      const script = document.createElement('script');
      script.src = 'https://static.elfsight.com/platform/platform.js';
      script.setAttribute('data-use-service-core', 'true');
      script.async = true;
      document.head.appendChild(script);

      // Alternative: Google Business Profile Reviews Widget
      // Nutze Google Maps Embed oder direkten Link
      console.log('✓ Google Reviews Widget initialisiert');
    }, 500);
  }
}

// Prüfe ob DOM bereits geladen ist
if (document.readyState === 'loading') {
  // DOM ist noch nicht geladen, warte auf DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM ist bereits geladen, führe direkt aus
  initializeApp();
}
