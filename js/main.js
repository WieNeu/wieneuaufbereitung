// Wie Neu Autoaufbereitung – Website-Skripte

function initializeApp() {
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
      if (notes) {
        message += `Notizen: ${notes}\n`;
      }

      // WhatsApp oder E-Mail
      const phoneNumber = '+4939344993858';
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

      // Fallback: Alert mit Info
      alert('Vielen Dank für deine Buchungsanfrage!\n\nDeine Anfrage:\n' + message + '\n\nWir melden uns in Kürze bei dir!');

      // Optional: WhatsApp öffnen
      // window.open(whatsappUrl, '_blank');

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

      alert(`Vielen Dank für deine Nachricht, ${name}!\n\nWir melden uns in Kürze bei dir.`);

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

  /* ---------- Review System with GitHub JSON + localStorage ---------- */
  // GitHub Raw: Kostenlos, öffentlich, keine Konfiguration!
  // Liest public reviews.json, neue Reviews gehen zu localStorage
  const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/gamerolixd-arch/wieneuaufbereitung/main/data/reviews.json';
  
  const reviewForm = document.getElementById('reviewForm');
  const testimonialsGrid = document.getElementById('testimonials-grid');

  if (reviewForm && testimonialsGrid) {
    // Lade Rezensionen von GitHub JSON + localStorage
    async function loadReviews() {
      let allReviews = [];
      
      // 1. Lade von GitHub Raw (öffentliche Reviews)
      try {
        const response = await fetch(GITHUB_RAW_URL, {
          headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          allReviews = data.reviews || [];
          console.log('✓ Reviews von GitHub geladen:', allReviews.length);
        }
      } catch (e) {
        console.log('GitHub API Fehler:', e.message);
      }
      
      // 2. Lade neue Reviews von localStorage
      try {
        const localReviews = JSON.parse(localStorage.getItem('wie-neu-reviews-new')) || [];
        if (localReviews.length > 0) {
          console.log('→ Füge localStorage Reviews hinzu:', localReviews.length);
          allReviews = [...localReviews, ...allReviews];
        }
      } catch (e) {
        console.log('localStorage Fehler:', e.message);
      }
      
      // Sortiere nach Datum (neueste zuerst)
      allReviews.sort((a, b) => {
        const dateA = typeof a.created_at === 'number' ? a.created_at : new Date(a.created_at).getTime();
        const dateB = typeof b.created_at === 'number' ? b.created_at : new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      
      console.log('✓ Gesamt Rezensionen:', allReviews.length);
      return allReviews.map(r => ({
        ...r,
        date: typeof r.created_at === 'number' ? 
          new Date(r.created_at).toLocaleDateString('de-DE') : 
          new Date(r.created_at).toLocaleDateString('de-DE')
      }));
    }

    // Zeige alle Rezensionen an
    async function displayReviews() {
      const reviews = await loadReviews();
      
      // Entferne alte dynamische Rezensionen
      const dynamicCards = testimonialsGrid.querySelectorAll('.testimonial-card.user-review');
      dynamicCards.forEach(card => card.remove());

      // Füge neue Rezensionen hinzu (neuste zuerst)
      reviews.forEach(function (review) {
        const card = document.createElement('div');
        card.className = 'testimonial-card user-review';
        
        // Generiere Sterne basierend auf Rating
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
          starsHtml += i < review.rating ? '⭐' : '☆';
        }

        const dateStr = review.date;

        card.innerHTML = `
          <div class="stars">${starsHtml}</div>
          <p>"${review.text}"</p>
          <p class="testimonial-author">– ${review.name}</p>
          <p class="review-date" style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">${dateStr}</p>
        `;
        
        testimonialsGrid.appendChild(card);
      });
    }

    // Form Submit Handler
    reviewForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('review-name').value;
      const email = document.getElementById('review-email').value;
      const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
      const text = document.getElementById('review-text').value;

      let success = false;

      // 1. Speichere neue Review zu localStorage
      try {
        let newReviews = JSON.parse(localStorage.getItem('wie-neu-reviews-new')) || [];
        newReviews.push({
          name: name,
          email: email,
          rating: rating,
          text: text,
          created_at: new Date().toISOString(),
          id: 'review-' + Date.now()
        });
        localStorage.setItem('wie-neu-reviews-new', JSON.stringify(newReviews));
        success = true;
        console.log('✓ Neue Review zu localStorage gespeichert');
      } catch (e) {
        console.log('localStorage Fehler:', e.message);
      }

      // 2. Sende zu Formspree (für Email-Benachrichtigung)
      const formspreeData = new FormData();
      formspreeData.append('name', name);
      formspreeData.append('email', email);
      formspreeData.append('rating', rating + ' Sterne');
      formspreeData.append('message', text);

      fetch('https://formspree.io/f/mpqvkozy', {
        method: 'POST',
        body: formspreeData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          console.log('✓ Formspree Email gesendet');
        }
      })
      .catch(error => {
        console.log('Formspree Fehler:', error);
      });

      // 3. Zeige Alert
      if (success) {
        alert('Vielen Dank für deine Rezension! 🌟\n\nDeine Bewertung ist jetzt öffentlich sichtbar!');
      } else {
        alert('Es gab einen Fehler beim Speichern der Rezension.');
      }

      // 4. Zeige neue Rezensionen
      displayReviews().catch(err => console.error('displayReviews Error:', err));

      // 5. Form zurücksetzen
      reviewForm.reset();

      // 6. Scroll zu Rezensionen
      setTimeout(function () {
        testimonialsGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });

    // Lade Rezensionen beim Laden
    displayReviews().catch(err => console.error('displayReviews Error:', err));
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

