// Wie Neu Autoaufbereitung – Website-Skripte

const pricingConfig = {
  discountRate: 0.2,
  packages: {
    fresh: { regular: 39 },
    care: { regular: 99 },
    wikeneu: { regular: 189 },
    showroom: { regular: 299 }
  },
  extras: {
    tierhaar: 29,
    ozon: 49,
    scheibe: 19,
    felge: 49,
    insekt: 19,
    keramik: 149,
    leder: 49,
    kunststoff: 29
  }
};

function formatCurrency(value, fractionDigits = 2) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
}

function initializeApp() {
  function initializeAnalyticsConsent() {
    const measurementId = 'G-28W3N190Q4';
    const consentCookieName = 'wieneu_analytics_consent';
    const savedConsent = document.cookie.split(';').map(function (cookie) {
      return cookie.trim();
    }).find(function (cookie) {
      return cookie.indexOf(consentCookieName + '=') === 0;
    });
    const consent = savedConsent ? savedConsent.split('=').slice(1).join('=') : '';

    function saveConsent(value) {
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = consentCookieName + '=' + value + '; Max-Age=15552000; Path=/; SameSite=Lax' + secure;
    }

    function enableAnalytics() {
      if (window.gtag) return;

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag('consent', 'default', { analytics_storage: 'denied' });
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      window.gtag('js', new Date());
      window.gtag('config', measurementId);

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
      document.head.appendChild(script);
    }

    function disableAnalytics() {
      if (window.gtag) {
        window.gtag('consent', 'update', { analytics_storage: 'denied' });
      }

      const analyticsCookies = document.cookie.split(';').map(function (cookie) {
        return cookie.trim().split('=')[0];
      }).filter(function (name) {
        return /^_ga(?:_|$)/.test(name);
      });
      const hostnameParts = window.location.hostname.split('.');
      const domainAttributes = [''];

      for (let index = 0; index < hostnameParts.length - 1; index += 1) {
        const domain = hostnameParts.slice(index).join('.');
        domainAttributes.push('; Domain=' + domain, '; Domain=.' + domain);
      }

      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      analyticsCookies.forEach(function (name) {
        domainAttributes.forEach(function (domainAttribute) {
          document.cookie = name + '=; Max-Age=0; Path=/' + domainAttribute + '; SameSite=Lax' + secure;
        });
      });
    }

    document.body.insertAdjacentHTML('beforeend',
      '<section class="cookie-consent" id="cookieConsent" role="dialog" aria-labelledby="cookieConsentTitle" aria-describedby="cookieConsentDescription" hidden>' +
        '<div class="cookie-consent-copy">' +
          '<h2 id="cookieConsentTitle">Datenschutz-Einstellungen</h2>' +
          '<p id="cookieConsentDescription">Mit Ihrer Zustimmung verwenden wir Google Analytics, um die Nutzung unserer Website auszuwerten. Ohne Zustimmung wird Analytics nicht geladen. Ihre Auswahl können Sie jederzeit ändern.</p>' +
          '<a href="datenschutz.html">Datenschutzerklärung</a>' +
        '</div>' +
        '<div class="cookie-consent-actions">' +
          '<button type="button" class="cookie-consent-button cookie-consent-reject" data-analytics-consent="denied">Ablehnen</button>' +
          '<button type="button" class="cookie-consent-button cookie-consent-accept" data-analytics-consent="granted">Akzeptieren</button>' +
        '</div>' +
      '</section>'
    );

    const panel = document.getElementById('cookieConsent');
    const footerBottom = document.querySelector('.footer-bottom');
    let settingsButton = null;
    let openedFromSettings = false;

    if (footerBottom) {
      settingsButton = document.createElement('button');
      settingsButton.type = 'button';
      settingsButton.className = 'cookie-settings-trigger';
      settingsButton.textContent = 'Cookie-Einstellungen';
      footerBottom.appendChild(settingsButton);
      settingsButton.addEventListener('click', function () {
        openedFromSettings = true;
        panel.hidden = false;
        panel.querySelector('[data-analytics-consent="denied"]').focus();
      });
    }

    panel.addEventListener('click', function (event) {
      const button = event.target.closest('[data-analytics-consent]');
      if (!button) return;

      const selectedConsent = button.getAttribute('data-analytics-consent');
      saveConsent(selectedConsent);
      if (selectedConsent === 'granted') {
        enableAnalytics();
      } else {
        disableAnalytics();
      }

      panel.hidden = true;
  if (openedFromSettings && settingsButton) settingsButton.focus();
  openedFromSettings = false;
    });

    if (consent === 'granted') {
      enableAnalytics();
    } else {
      disableAnalytics();
      if (consent !== 'denied') panel.hidden = false;
    }
  }

  initializeAnalyticsConsent();

  const businessVideo = document.getElementById('businessVideo');
  const businessVideoToggle = document.getElementById('businessVideoToggle');
  if (businessVideo && businessVideoToggle) {
    function keepBusinessVideoSilent() {
      if (!businessVideo.muted) businessVideo.muted = true;
      if (businessVideo.volume !== 0) businessVideo.volume = 0;
    }

    function updateBusinessVideoToggle() {
      const isPlaying = !businessVideo.paused && !businessVideo.ended;
      businessVideoToggle.textContent = isPlaying ? 'Video pausieren' : 'Video abspielen';
      businessVideoToggle.setAttribute('aria-label', businessVideoToggle.textContent);
    }

    businessVideo.addEventListener('volumechange', keepBusinessVideoSilent);
    businessVideo.addEventListener('play', function () {
      keepBusinessVideoSilent();
      updateBusinessVideoToggle();
    });
    businessVideo.addEventListener('pause', updateBusinessVideoToggle);
    businessVideo.addEventListener('ended', updateBusinessVideoToggle);
    businessVideoToggle.addEventListener('click', function () {
      keepBusinessVideoSilent();
      if (businessVideo.paused || businessVideo.ended) {
        const playAttempt = businessVideo.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
          playAttempt.catch(updateBusinessVideoToggle);
        }
      } else {
        businessVideo.pause();
      }
    });
    keepBusinessVideoSilent();
  }

  const header = document.getElementById('header');
  let resetBookingFlow = null;
  const businessPhone = '4915233938332';
  const packageLabels = {
    fresh: 'Frisch gemacht',
    care: 'Wieder gepflegt',
    wikeneu: 'Wie Neu',
    showroom: 'Showroom Edition'
  };

  Object.entries(pricingConfig.packages).forEach(function (entry) {
    const packageId = entry[0];
    const regularPrice = entry[1].regular;
    const discountedPrice = Math.round(regularPrice * (1 - pricingConfig.discountRate) * 100) / 100;
    document.querySelectorAll(`[data-package-price="${packageId}"]`).forEach(function (element) {
      element.textContent = formatCurrency(discountedPrice);
    });
    document.querySelectorAll(`[data-original-package-price="${packageId}"]`).forEach(function (element) {
      element.textContent = formatCurrency(regularPrice, 0);
    });
  });

  Object.entries(pricingConfig.extras).forEach(function (entry) {
    const extraId = entry[0];
    const price = entry[1];
    document.querySelectorAll(`[data-extra-price="${extraId}"]`).forEach(function (element) {
      element.textContent = formatCurrency(price, 0);
    });
  });

  function openWhatsApp(text) {
    const url = `https://wa.me/${businessPhone}?text=${encodeURIComponent(text)}`;
    const whatsappWindow = window.open(url, '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;
    return Boolean(whatsappWindow);
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
    navToggle.setAttribute('aria-label', 'Menü schließen');
  }

  function closeMenu() {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
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

  function openModal(modalId, requestType) {
    const modal = document.getElementById(modalId);
    if (modal) {
      if (modalId === 'bookingModal' && resetBookingFlow) resetBookingFlow();
      if (modalId === 'bookingModal' && requestType) {
        const requestTypeOption = document.querySelector(`#bookingForm input[name="requestType"][value="${requestType}"]`);
        if (requestTypeOption) requestTypeOption.checked = true;
      }
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
    const modalTrigger = e.target.closest('[data-modal]');
    const closeTrigger = e.target.closest('[data-close-modal]');
    // Open Modal
    if (modalTrigger) {
      openModal(modalTrigger.dataset.modal, modalTrigger.dataset.requestType);
    }
    // Close Modal
    if (closeTrigger) {
      closeModal(closeTrigger.dataset.closeModal);
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
        `ich interessiere mich für das Paket "${packageName}".`,
        'Ist in den nächsten Tagen ein Termin frei?',
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
    const requestTypeStep = document.getElementById('bookingTypeStep');
    const requestTypeRadios = bookingForm.querySelectorAll('input[name="requestType"]');
    const startBookingFlow = document.getElementById('startBookingFlow');
    const businessConfirmation = document.getElementById('businessBookingConfirmation');
    const bookingFlows = {};
    bookingForm.querySelectorAll('[data-booking-flow]').forEach(function (container) {
      const flowName = container.dataset.bookingFlow;
      bookingFlows[flowName] = {
        container: container,
        steps: Array.from(container.querySelectorAll('[data-booking-step]')),
        progressItems: Array.from(container.querySelectorAll('[data-progress-step]')),
        status: container.querySelector('.booking-step-status')
      };
    });
    const packagePriceEl = document.getElementById('packagePrice');
    const extrasPriceEl = document.getElementById('extrasPrice');
    const totalPriceEl = document.getElementById('totalPrice');
    const extrasRow = document.getElementById('extrasRow');
    let activeFlowName = null;

    function setFlowDisabled(flow, isDisabled) {
      flow.container.querySelectorAll('input, textarea, select').forEach(function (field) {
        field.disabled = isDisabled;
      });
    }

    function showRequestTypeStep() {
      activeFlowName = null;
      requestTypeStep.hidden = false;
      Object.values(bookingFlows).forEach(function (flow) {
        flow.container.hidden = true;
        setFlowDisabled(flow, true);
      });
      if (businessConfirmation) businessConfirmation.hidden = true;
      bookingForm.hidden = false;
    }

    function showBookingStep(flowName, stepIndex) {
      const flow = bookingFlows[flowName];
      activeFlowName = flowName;
      requestTypeStep.hidden = true;
      Object.values(bookingFlows).forEach(function (otherFlow) {
        otherFlow.container.hidden = otherFlow !== flow;
        setFlowDisabled(otherFlow, otherFlow !== flow);
      });
      const activeBookingStep = Math.max(0, Math.min(stepIndex, flow.steps.length - 1));
      flow.steps.forEach(function (step, index) {
        const isActive = index === activeBookingStep;
        step.hidden = !isActive;
        step.classList.toggle('is-active', isActive);
      });
      flow.progressItems.forEach(function (item, index) {
        item.classList.toggle('is-current', index === activeBookingStep);
        item.classList.toggle('is-complete', index < activeBookingStep);
        if (index === activeBookingStep) item.setAttribute('aria-current', 'step');
        else item.removeAttribute('aria-current');
      });
      if (flow.status) {
        const heading = flow.steps[activeBookingStep].querySelector('h3');
        flow.status.textContent = `Schritt ${activeBookingStep + 1} von ${flow.steps.length} · ${heading.textContent.trim()}`;
      }
      if (flowName === 'business') updateBusinessSummary();
      const firstField = flow.steps[activeBookingStep].querySelector('input:checked, input:not([type="hidden"]), textarea, select, button');
      if (firstField) firstField.focus({ preventScroll: true });
    }

    function updateBusinessConditionalFields() {
      const vehicleType = bookingForm.querySelector('input[name="businessVehicleType"]:checked');
      const otherVehicleGroup = document.getElementById('businessVehicleOtherGroup');
      const otherVehicleInput = document.getElementById('businessVehicleOther');
      const isOtherVehicle = vehicleType && vehicleType.value === 'Sonstiges';
      otherVehicleGroup.hidden = !isOtherVehicle;
      otherVehicleInput.required = Boolean(isOtherVehicle);

      const quantity = bookingForm.querySelector('input[name="businessQuantity"]:checked');
      const isSingleVehicle = quantity && quantity.value === '1 Fahrzeug';
      const singleVehicleFields = document.getElementById('businessSingleVehicle');
      const fleetDetails = document.getElementById('businessFleetDetails');
      const fleetDescription = document.getElementById('businessFleetDescription');
      singleVehicleFields.hidden = !isSingleVehicle;
      singleVehicleFields.querySelectorAll('input, textarea, select').forEach(function (field) {
        field.disabled = !isSingleVehicle;
        field.required = isSingleVehicle && (field.id === 'businessMake' || field.id === 'businessModel');
      });
      fleetDetails.hidden = Boolean(isSingleVehicle);
      fleetDescription.disabled = Boolean(isSingleVehicle);
      fleetDescription.required = Boolean(quantity && !isSingleVehicle);

      const otherService = document.getElementById('businessServiceOther');
      const otherServiceGroup = document.getElementById('businessServiceOtherGroup');
      const serviceNotes = document.getElementById('businessServiceNotes');
      const isOtherService = otherService.checked;
      otherServiceGroup.hidden = !isOtherService;
      serviceNotes.disabled = !isOtherService;
      serviceNotes.required = isOtherService;
    }

    function getBusinessValue(name) {
      const checkedField = bookingForm.querySelector(`[name="${name}"]:checked`);
      if (checkedField) return checkedField.value;
      const field = bookingForm.elements.namedItem(name);
      return field && !field.disabled ? field.value.trim() : '';
    }

    function updateBusinessSummary() {
      const vehicleType = getBusinessValue('businessVehicleType');
      const vehicleOther = getBusinessValue('businessVehicleOther');
      const quantity = getBusinessValue('businessQuantity');
      const serviceNotes = getBusinessValue('businessServiceNotes');
      const services = Array.from(bookingForm.querySelectorAll('input[name="businessService"]:checked')).map(function (field) {
        return field.value === 'Sonstiges' && serviceNotes ? `Sonstiges: ${serviceNotes}` : field.value;
      });
      const vehicleDetails = quantity === '1 Fahrzeug'
        ? [getBusinessValue('businessMake'), getBusinessValue('businessModel'), getBusinessValue('businessYear'), getBusinessValue('businessSize'), getBusinessValue('businessVehicleNotes')].filter(Boolean).join(' · ')
        : getBusinessValue('businessFleetDescription');
      const timeframe = [getBusinessValue('businessTimeframe'), getBusinessValue('businessDate')].filter(Boolean).join(' · ');
      const summaryValues = {
        businessSummaryVehicle: vehicleType === 'Sonstiges' ? vehicleOther || vehicleType : vehicleType,
        businessSummaryQuantity: quantity,
        businessSummaryServices: services.join(', '),
        businessSummaryDetails: vehicleDetails,
        businessSummaryTime: timeframe,
        businessSummaryCompany: getBusinessValue('businessCompany'),
        businessSummaryContact: getBusinessValue('businessContact'),
        businessSummaryEmail: getBusinessValue('businessEmail'),
        businessSummaryPhone: getBusinessValue('businessPhone')
      };
      Object.keys(summaryValues).forEach(function (id) {
        const summary = document.getElementById(id);
        if (summary) summary.textContent = summaryValues[id] || 'Noch nicht angegeben';
      });
    }

    if (startBookingFlow) {
      startBookingFlow.addEventListener('click', function () {
        const selectedType = bookingForm.querySelector('input[name="requestType"]:checked');
        if (!selectedType) {
          requestTypeRadios[0].reportValidity();
          return;
        }
        updateBusinessConditionalFields();
        showBookingStep(selectedType.value, 0);
      });
    }

    bookingForm.querySelectorAll('input[name="businessVehicleType"], input[name="businessQuantity"], #businessServiceOther').forEach(function (field) {
      field.addEventListener('change', updateBusinessConditionalFields);
    });
    bookingForm.querySelectorAll('[data-booking-flow="business"] input, [data-booking-flow="business"] textarea, [data-booking-flow="business"] select').forEach(function (field) {
      field.addEventListener('input', updateBusinessSummary);
      field.addEventListener('change', updateBusinessSummary);
    });

    Object.keys(bookingFlows).forEach(function (flowName) {
      const flow = bookingFlows[flowName];
      flow.steps.forEach(function (step, index) {
        const controls = document.createElement('div');
        controls.className = 'booking-step-controls';

        const backButton = document.createElement('button');
        backButton.type = 'button';
        backButton.className = 'btn btn-outline';
        backButton.textContent = index > 0 ? 'Zurück' : 'Anfrageart ändern';
        backButton.addEventListener('click', function () {
          if (index > 0) showBookingStep(flowName, index - 1);
          else showRequestTypeStep();
        });
        controls.appendChild(backButton);

        if (index < flow.steps.length - 1) {
          const nextButton = document.createElement('button');
          nextButton.type = 'button';
          nextButton.className = 'btn btn-primary';
          nextButton.textContent = 'Weiter';
          nextButton.addEventListener('click', function () {
            if (flowName === 'business' && index === 2 && !bookingForm.querySelector('input[name="businessService"]:checked')) {
              const firstService = bookingForm.querySelector('input[name="businessService"]');
              firstService.setCustomValidity('Bitte wähle mindestens eine gewünschte Leistung aus.');
              firstService.reportValidity();
              firstService.setCustomValidity('');
              return;
            }
            const requiredFields = Array.from(step.querySelectorAll('input, textarea, select')).filter(function (field) {
              return field.required && !field.disabled;
            });
            if (!requiredFields.every(function (field) { return field.reportValidity(); })) return;
            showBookingStep(flowName, index + 1);
          });
          controls.appendChild(nextButton);
        }

        const submitButton = step.querySelector('button[type="submit"]');
        if (submitButton) step.insertBefore(controls, submitButton);
        else step.appendChild(controls);
      });
    });

    resetBookingFlow = function () {
      requestTypeRadios.forEach(function (radio) { radio.checked = false; });
      showRequestTypeStep();
    };
    bookingForm.addEventListener('reset', function () {
      showRequestTypeStep();
    });

    function updatePrice() {
      let packagePrice = 0;
      let originalPackagePrice = 0;
      let extrasPrice = 0;

      // Paket-Preis
      packageRadios.forEach(function (radio) {
        if (radio.checked) {
          const packagePricing = pricingConfig.packages[radio.value];
          if (packagePricing) {
            originalPackagePrice = packagePricing.regular;
            packagePrice = Math.round(originalPackagePrice * (1 - pricingConfig.discountRate) * 100) / 100;
          }
        }
      });

      // Zusatzleistungen-Preis
      extraCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          extrasPrice += pricingConfig.extras[checkbox.value] || 0;
        }
      });

      const discount = Math.round(originalPackagePrice * pricingConfig.discountRate * 100) / 100;
      const totalOriginal = originalPackagePrice;
      const totalPrice = packagePrice + extrasPrice;

      document.getElementById('originalPrice').textContent = formatCurrency(totalOriginal);
      document.getElementById('discountPrice').textContent = '-' + formatCurrency(discount);
      document.getElementById('packagePrice').textContent = formatCurrency(packagePrice);
      document.getElementById('extrasPrice').textContent = formatCurrency(extrasPrice);
      document.getElementById('totalPrice').textContent = formatCurrency(totalPrice);

      const selectedPackage = Array.from(packageRadios).find(function (radio) { return radio.checked; });
      const packageSummary = document.getElementById('bookingPackageSummary');
      const vehicleSummary = document.getElementById('bookingVehicleSummary');
      const extrasSummary = document.getElementById('bookingExtrasSummary');
      const dateSummary = document.getElementById('bookingDateSummary');
      const vehicleInput = document.getElementById('booking-vehicle');
      if (packageSummary && selectedPackage) packageSummary.textContent = packageLabels[selectedPackage.value] || selectedPackage.value;
      if (vehicleSummary) vehicleSummary.textContent = vehicleInput && vehicleInput.value.trim() ? vehicleInput.value.trim() : 'Noch nicht angegeben';
      if (dateSummary) {
        dateSummary.textContent = dateInput && dateInput.value
          ? new Intl.DateTimeFormat('de-DE').format(new Date(dateInput.value + 'T00:00:00'))
          : 'Noch nicht ausgewählt';
      }
      [
        ['booking-name', 'bookingNameSummary'],
        ['booking-email', 'bookingEmailSummary'],
        ['booking-phone', 'bookingPhoneSummary']
      ].forEach(function (fieldPair) {
        const input = document.getElementById(fieldPair[0]);
        const summary = document.getElementById(fieldPair[1]);
        if (summary) summary.textContent = input && input.value.trim() ? input.value.trim() : 'Noch nicht angegeben';
      });
      if (extrasSummary) {
        extrasSummary.textContent = Array.from(extraCheckboxes).filter(function (checkbox) { return checkbox.checked; }).map(function (checkbox) {
          const label = checkbox.parentElement.querySelector('span');
          return label ? label.textContent.trim() : checkbox.value;
        }).join(', ') || 'Keine';
      }

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
    const vehicleInput = document.getElementById('booking-vehicle');
    if (vehicleInput) vehicleInput.addEventListener('input', updatePrice);
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      const today = new Date();
      dateInput.min = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
      dateInput.addEventListener('change', updatePrice);
    }
    ['booking-name', 'booking-email', 'booking-phone'].forEach(function (id) {
      const input = document.getElementById(id);
      if (input) input.addEventListener('input', updatePrice);
    });

    // Booking Form Submit
    bookingForm.addEventListener('submit', function (e) {
      const requestType = bookingForm.querySelector('input[name="requestType"]:checked');
      const isBusinessRequest = requestType && requestType.value === 'business';
      const agbCheckbox = document.getElementById(isBusinessRequest ? 'businessAcceptAgb' : 'accept-agb');
      const privacyCheckbox = document.getElementById(isBusinessRequest ? 'businessAcceptDatenschutz' : 'accept-datenschutz');

      if (!bookingForm.checkValidity()) {
        e.preventDefault();
        const invalidField = bookingForm.querySelector(':invalid:not(:disabled)');
        if (invalidField) invalidField.reportValidity();
        return;
      }

      e.preventDefault();

      if (!agbCheckbox.checked || !privacyCheckbox.checked) {
        alert('Bitte bestätige AGB und Datenschutzerklärung, bevor du die Anfrage fortsetzt.');
        return;
      }

      if (isBusinessRequest) {
        const formData = new FormData(bookingForm);
        const getValue = function (name) { return String(formData.get(name) || '').trim(); };
        const quantity = getValue('businessQuantity');
        const vehicleDetails = quantity === '1 Fahrzeug'
          ? [getValue('businessMake'), getValue('businessModel'), getValue('businessYear'), getValue('businessSize'), getValue('businessVehicleNotes')].filter(Boolean).join(' · ')
          : getValue('businessFleetDescription');
        const services = formData.getAll('businessService').map(function (service) {
          return service === 'Sonstiges' && getValue('businessServiceNotes')
            ? `Sonstiges: ${getValue('businessServiceNotes')}`
            : service;
        });
        const vehicleType = getValue('businessVehicleType') === 'Sonstiges'
          ? getValue('businessVehicleOther')
          : getValue('businessVehicleType');
        const address = [getValue('businessStreet'), getValue('businessPostalCode'), getValue('businessCity')].filter(Boolean).join(', ');
        const message = [
          'GEWERBE-ANFRAGE',
          'request_type: business',
          '',
          `Fahrzeugart: ${vehicleType}`,
          `Anzahl: ${quantity}`,
          `Gewünschte Leistungen: ${services.join(', ')}`,
          `Fahrzeugdaten: ${vehicleDetails}`,
          `Wunschzeitraum: ${getValue('businessTimeframe')}`,
          `Wunschdatum: ${getValue('businessDate') || 'Kein festes Datum'}`,
          `Unternehmen: ${getValue('businessCompany')}`,
          `Ansprechpartner: ${getValue('businessContact')}`,
          `E-Mail: ${getValue('businessEmail')}`,
          `Telefon: ${getValue('businessPhone')}`,
          `Bevorzugter Kontakt: ${getValue('businessPreferredContact')}`,
          address ? `Anschrift: ${address}` : '',
          'Preis: Individuelles Angebot',
          'AGB und Datenschutzerklärung akzeptiert.'
        ].filter(Boolean).join('\n');

        if (openWhatsApp(message)) {
          bookingForm.hidden = true;
          businessConfirmation.hidden = false;
        } else {
          alert('WhatsApp konnte nicht automatisch geöffnet werden. Bitte prüfe deine Browser-Einstellungen und versuche es erneut.');
        }
        return;
      }

      const name = document.getElementById('booking-name').value;
      const email = document.getElementById('booking-email').value;
      const phone = document.getElementById('booking-phone').value;
      const date = document.getElementById('booking-date').value;
      const notes = document.getElementById('booking-notes').value;
      const vehicle = document.getElementById('booking-vehicle').value;

      let selectedPackage = '';
      packageRadios.forEach(function (radio) {
        if (radio.checked) selectedPackage = packageLabels[radio.value] || radio.value;
      });

      let selectedExtras = [];
      extraCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          const label = checkbox.parentElement.querySelector('span');
          selectedExtras.push(label ? label.textContent.trim() : checkbox.value);
        }
      });

      const totalPrice = totalPriceEl.textContent;

      // Nachricht zusammenstellen
      let message = `Buchungsanfrage:\nrequest_type: private\n\n`;
      message += `Name: ${name}\n`;
      message += `Email: ${email}\n`;
      message += `Telefon: ${phone}\n`;
      message += `Wunschdatum: ${date}\n`;
      if (vehicle) message += `Fahrzeug: ${vehicle}\n`;
      message += `Paket: ${selectedPackage}\n`;
      if (selectedExtras.length > 0) {
        message += `Zusatzleistungen: ${selectedExtras.join(', ')}\n`;
      }
      message += `Gesamtpreis: ${totalPrice}\n`;
      message += `Ich habe die AGB und die Datenschutzbestimmungen gelesen und akzeptiere sie.\n`;
      if (notes) {
        message += `Notizen: ${notes}\n`;
      }

      alert('Deine Anfrage wird in WhatsApp vorbereitet. Bitte sende die Nachricht dort ab, damit sie bei uns eingeht.');
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
        'Kontaktanfrage über Website',
        '',
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone}`,
        `Nachricht: ${message || 'Keine Zusatznachricht'}`
      ].join('\n');

      alert(`Vielen Dank für deine Nachricht, ${name}!\n\nWir öffnen jetzt WhatsApp für die direkte Terminabstimmung.`);
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

}

// Prüfe ob DOM bereits geladen ist
if (document.readyState === 'loading') {
  // DOM ist noch nicht geladen, warte auf DOMContentLoaded
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM ist bereits geladen, führe direkt aus
  initializeApp();
}
