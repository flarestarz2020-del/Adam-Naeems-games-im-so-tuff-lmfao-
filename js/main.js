// ============================================================
//  MOM Finland — Homepage JS
//  Handles: Nav scroll, mobile menu, calendar, booking form,
//           persona selection, scroll animations
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ── Mobile menu ──
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── Persona Card selection ──
  const personaCards = document.querySelectorAll('.persona-card');
  personaCards.forEach(card => {
    card.addEventListener('click', () => {
      personaCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const path = card.dataset.path;
      if (path === 'services') {
        window.location.href = 'pages/services.html';
      }
    });
  });

  // ── Scroll animation observer ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ── Booking Calendar ──
  initCalendar();

  // ── Booking Form ──
  initBookingForm();

});

// ============================================================
//  Calendar Engine
// ============================================================
function initCalendar() {
  const calGrid = document.getElementById('calGrid');
  const calMonthLabel = document.getElementById('calMonthLabel');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const selectedSlotDisplay = document.getElementById('selectedSlotDisplay');

  if (!calGrid) return;

  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();
  let selectedDate = null;
  let selectedTime = null;

  // Unavailable days of week: 0=Sun, 6=Sat
  const unavailableWeekdays = [0, 6];

  // Unavailable specific dates (yyyy-mm-dd)
  const unavailableDates = [];

  // Available time slots
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                     '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];

  // Randomly mark some slots as unavailable for realism
  const unavailableSlots = ['09:30', '13:30', '15:00'];

  const monthNames = {
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    fi: ['Tammikuu','Helmikuu','Maaliskuu','Huhtikuu','Toukokuu','Kesäkuu','Heinäkuu','Elokuu','Syyskuu','Lokakuu','Marraskuu','Joulukuu'],
    sv: ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'],
  };

  function getMonthName() {
    const lang = localStorage.getItem('momLang') || 'en';
    return (monthNames[lang] || monthNames.en)[viewMonth];
  }

  function renderCalendar() {
    calGrid.innerHTML = '';
    calMonthLabel.textContent = `${getMonthName()} ${viewYear}`;

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Mon-start

    // Empty cells
    for (let i = 0; i < offset; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      calGrid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day';
      dayEl.textContent = d;

      const date = new Date(viewYear, viewMonth, d);
      const dateStr = formatDate(date);
      const isToday = dateStr === formatDate(today);
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekendUnavail = unavailableWeekdays.includes(date.getDay());
      const isSpecificUnavail = unavailableDates.includes(dateStr);

      if (isToday) dayEl.classList.add('today');

      if (isPast || isWeekendUnavail || isSpecificUnavail) {
        dayEl.classList.add('unavailable');
      } else {
        dayEl.classList.add('available');
        if (dateStr === selectedDate) dayEl.classList.add('selected');

        dayEl.addEventListener('click', () => {
          selectedDate = dateStr;
          selectedTime = null;
          renderCalendar();
          renderTimeSlots();
          updateSelectedSlot();
        });
      }

      calGrid.appendChild(dayEl);
    }
  }

  function renderTimeSlots() {
    if (!timeSlotsContainer) return;
    timeSlotsContainer.innerHTML = '';

    timeSlots.forEach(slot => {
      const el = document.createElement('div');
      el.className = 'time-slot';
      el.textContent = slot;

      if (unavailableSlots.includes(slot)) {
        el.classList.add('unavailable');
      } else {
        if (slot === selectedTime) el.classList.add('selected');
        el.addEventListener('click', () => {
          selectedTime = slot;
          document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
          el.classList.add('selected');
          updateSelectedSlot();
        });
      }

      timeSlotsContainer.appendChild(el);
    });
  }

  function updateSelectedSlot() {
    if (!selectedSlotDisplay) return;
    if (selectedDate && selectedTime) {
      const d = new Date(selectedDate + 'T00:00:00');
      const formatted = d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      selectedSlotDisplay.innerHTML = `📅 <strong>${formatted}</strong> at <strong>${selectedTime}</strong>`;
      selectedSlotDisplay.dataset.date = selectedDate;
      selectedSlotDisplay.dataset.time = selectedTime;
    } else if (selectedDate) {
      const d = new Date(selectedDate + 'T00:00:00');
      const formatted = d.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
      selectedSlotDisplay.innerHTML = `📅 ${formatted} — select a time`;
    } else {
      selectedSlotDisplay.innerHTML = '📅 No date selected yet';
    }
  }

  function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  calPrev && calPrev.addEventListener('click', () => {
    viewMonth--;
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  });

  calNext && calNext.addEventListener('click', () => {
    viewMonth++;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    renderCalendar();
  });

  // Re-render on lang change
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setTimeout(renderCalendar, 50));
  });

  renderCalendar();
  if (selectedDate) renderTimeSlots();
  updateSelectedSlot();
}

// ============================================================
//  Booking Form
// ============================================================
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const topic = form.querySelector('[name="topic"]').value;
    const slotDisplay = document.getElementById('selectedSlotDisplay');
    const date = slotDisplay?.dataset?.date || '';
    const time = slotDisplay?.dataset?.time || '';

    if (!name || !email || !topic) {
      shakeForm(form);
      return;
    }

    const submitBtn = form.querySelector('.btn-book');
    submitBtn.textContent = '⏳ Booking...';
    submitBtn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/xeevwoyn', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, date, time })
      });

      if (response.ok) {
        const successMsg = document.getElementById('bookingSuccess');
        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.textContent = window.t ? window.t('booking_success') : '🎉 Booking confirmed! We\'ll email you shortly.';
        }
      } else {
        throw new Error('Formspree error');
      }
    } catch (err) {
      submitBtn.textContent = '❌ Something went wrong. Try again.';
      submitBtn.disabled = false;
      setTimeout(() => {
        submitBtn.textContent = window.t ? window.t('booking_submit') : 'Confirm Booking';
      }, 3000);
    }
  });
}

function shakeForm(form) {
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => form.style.animation = '', 400);
}

// Expose t() globally for inline use
window.t = (key) => {
  if (typeof translations !== 'undefined' && typeof currentLang !== 'undefined') {
    return (translations[currentLang] && translations[currentLang][key]) ||
           (translations['en'] && translations['en'][key]) || key;
  }
  return key;
};
