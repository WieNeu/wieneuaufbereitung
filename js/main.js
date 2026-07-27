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

  /* ---------- Review System with Firebase ---------- */
  
  // Firebase Konfiguration
  const firebaseConfig = {
    apiKey: "AIzaSyBwT1fLOGJ-5n2K8ypqKgR8QzJnG1vQ9vU",
    authDomain: "wie-neu-reviews.firebaseapp.com",
    projectId: "wie-neu-reviews",
    storageBucket: "wie-neu-reviews.appspot.com",
    messagingSenderId: "123456789012",
    databaseURL: "https://wie-neu-reviews-default-rtdb.europe-west1.firebasedatabase.app"
  };

  // Firebase initialisieren
  try {
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    var reviewsRef = database.ref('reviews');
    var reviewForm = document.getElementById('reviewForm');
    var testimonialsGrid = document.getElementById('testimonials-grid');

    if (reviewForm && testimonialsGrid) {
      // Lade Rezensionen aus Firebase in Echtzeit
      function displayReviews() {
        reviewsRef.orderByChild('timestamp').on('value', function(snapshot) {
          // Entferne alle bisherigen Rezensionen
          const oldCards = testimonialsGrid.querySelectorAll('.testimonial-card.user-review');
          oldCards.forEach(card => card.remove());

          // Zeige neue Rezensionen (neuste zuerst)
          const reviews = [];
          snapshot.forEach(function(childSnapshot) {
            reviews.push(childSnapshot.val());
          });

          // Reverse für neuste zuerst
          reviews.reverse().forEach(function(review) {
            const card = document.createElement('div');
            card.className = 'testimonial-card user-review';
            
            // Generiere Sterne basierend auf Rating
            let starsHtml = '';
            for (let i = 0; i < 5; i++) {
              starsHtml += i < review.rating ? '⭐' : '☆';
            }

            const date = new Date(review.timestamp);
            const dateString = date.toLocaleDateString('de-DE');

            card.innerHTML = `
              <div class="stars">${starsHtml}</div>
              <p>"${review.text}"</p>
              <p class="testimonial-author">– ${review.name}</p>
              <p class="review-date" style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">${dateString}</p>
            `;
            
            testimonialsGrid.appendChild(card);
          });
        });
      }

      // Form Submit Handler
      reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('review-name').value;
        const email = document.getElementById('review-email').value;
        const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
        const text = document.getElementById('review-text').value;

        // Neue Rezension erstellen
        const newReview = {
          name: name,
          email: email,
          rating: rating,
          text: text,
          timestamp: new Date().getTime()
        };

        // Speichere in Firebase
        reviewsRef.push(newReview, function(error) {
          if (error) {
            alert('Fehler beim Speichern: ' + error.message);
          } else {
            alert('Vielen Dank für deine Rezension! 🌟\n\nDeine Bewertung ist jetzt öffentlich sichtbar!');
            
            // Form zurücksetzen
            reviewForm.reset();

            // Scroll zu Rezensionen
            setTimeout(function () {
              testimonialsGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
        });
      });

      // Lade Rezensionen beim Seitenladen
      displayReviews();
    }
  } catch (error) {
    console.log('Firebase nicht verfügbar, localStorage wird verwendet');
    
    // Fallback zu localStorage wenn Firebase nicht verfügbar
    const reviewForm = document.getElementById('reviewForm');
    const testimonialsGrid = document.getElementById('testimonials-grid');

    if (reviewForm && testimonialsGrid) {
      function loadReviews() {
        const reviews = JSON.parse(localStorage.getItem('wie-neu-reviews')) || [];
        return reviews;
      }

      function displayReviews() {
        const reviews = loadReviews();
        const dynamicCards = testimonialsGrid.querySelectorAll('.testimonial-card.user-review');
        dynamicCards.forEach(card => card.remove());

        reviews.reverse().forEach(function (review) {
          const card = document.createElement('div');
          card.className = 'testimonial-card user-review';
          
          let starsHtml = '';
          for (let i = 0; i < 5; i++) {
            starsHtml += i < review.rating ? '⭐' : '☆';
          }

          card.innerHTML = `
            <div class="stars">${starsHtml}</div>
            <p>"${review.text}"</p>
            <p class="testimonial-author">– ${review.name}</p>
            <p class="review-date" style="font-size: 0.8rem; color: var(--text-tertiary); margin-top: 0.5rem;">Lokal gespeichert</p>
          `;
          
          testimonialsGrid.appendChild(card);
        });
      }

      reviewForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('review-name').value;
        const email = document.getElementById('review-email').value;
        const rating = parseInt(document.querySelector('input[name="rating"]:checked').value);
        const text = document.getElementById('review-text').value;

        const newReview = {
          name: name,
          email: email,
          rating: rating,
          text: text,
          date: new Date().toLocaleDateString('de-DE')
        };

        let reviews = JSON.parse(localStorage.getItem('wie-neu-reviews')) || [];
        reviews.push(newReview);
        localStorage.setItem('wie-neu-reviews', JSON.stringify(reviews));

        alert('Rezension gespeichert (Lokale Speicherung)');
        displayReviews();
        reviewForm.reset();
      });

      displayReviews();
    }
  }

});

