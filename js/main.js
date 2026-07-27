// Wie Neu Autoaufbereitung – Website-Skripte
document.addEventListener('DOMContentLoaded', function () {

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

  /* ---------- Review System with Supabase + Formspree ---------- */
  const SUPABASE_URL = 'https://xdxfkoisqpankztirxcm.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_EACDElsN_V4zhr4GiMANOg_n1AvbObo';
  
  // Initialize Supabase
  let supabase = null;
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.log('Supabase nicht verfügbar, nutze localStorage fallback');
  }

  const reviewForm = document.getElementById('reviewForm');
  const testimonialsGrid = document.getElementById('testimonials-grid');

  if (reviewForm && testimonialsGrid) {
    // Lade Rezensionen von Supabase oder localStorage
    async function loadReviews() {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error && error.code !== 'PGRST116') {
            throw error;
          }
          
          if (data && data.length > 0) {
            return data.map(r => ({
              name: r.name,
              email: r.email,
              rating: r.rating,
              text: r.text,
              date: new Date(r.created_at).toLocaleDateString('de-DE'),
              id: r.id
            }));
          }
        } catch (e) {
          console.log('Supabase Fehler:', e);
        }
      }
      
      // Fallback zu localStorage
      const localReviews = JSON.parse(localStorage.getItem('wie-neu-reviews')) || [];
      return localReviews.map(r => ({
        ...r,
        date: typeof r.date === 'number' ? new Date(r.date).toLocaleDateString('de-DE') : r.date
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

      // 1. Versuche zu Supabase zu speichern
      if (supabase) {
        try {
          const { error } = await supabase
            .from('reviews')
            .insert([{
              name: name,
              email: email,
              rating: rating,
              text: text
            }]);
          
          if (!error) {
            success = true;
            console.log('✓ Review zu Supabase gespeichert');
          } else if (error.code === 'PGRST116') {
            // Tabelle existiert nicht - speichere zu localStorage als Fallback
            let reviews = JSON.parse(localStorage.getItem('wie-neu-reviews')) || [];
            reviews.push({
              name: name,
              email: email,
              rating: rating,
              text: text,
              date: new Date().toLocaleDateString('de-DE')
            });
            localStorage.setItem('wie-neu-reviews', JSON.stringify(reviews));
            success = true;
            console.log('✓ Review zu localStorage gespeichert (Supabase nicht bereit)');
          } else {
            throw error;
          }
        } catch (e) {
          console.log('Supabase Fehler:', e);
          // Fallback zu localStorage
          let reviews = JSON.parse(localStorage.getItem('wie-neu-reviews')) || [];
          reviews.push({
            name: name,
            email: email,
            rating: rating,
            text: text,
            date: new Date().toLocaleDateString('de-DE')
          });
          localStorage.setItem('wie-neu-reviews', JSON.stringify(reviews));
          success = true;
        }
      } else {
        // Supabase nicht verfügbar - nutze localStorage
        let reviews = JSON.parse(localStorage.getItem('wie-neu-reviews')) || [];
        reviews.push({
          name: name,
          email: email,
          rating: rating,
          text: text,
          date: new Date().toLocaleDateString('de-DE')
        });
        localStorage.setItem('wie-neu-reviews', JSON.stringify(reviews));
        success = true;
      }

      // 2. Sende zu Formspree (für Email)
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
      displayReviews();

      // 5. Form zurücksetzen
      reviewForm.reset();

      // 6. Scroll zu Rezensionen
      setTimeout(function () {
        testimonialsGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });

    // Lade Rezensionen beim Laden
    displayReviews();
  }

});

