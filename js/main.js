// =========================================================
// ODAK APART OTEL — main.js
// Adım 1: Header scroll efekti + Mobil navigasyon
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const header   = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks  = document.querySelectorAll('.nav-link');

  // Header scroll durumu
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll);

  // Mobil menü aç/kapat
  const closeNav = () => {
    mainNav.classList.remove('is-open');
    navOverlay.classList.remove('is-visible');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  const toggleNav = () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navOverlay.classList.toggle('is-visible', isOpen);
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };

  navToggle.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', closeNav);
  navLinks.forEach(link => link.addEventListener('click', closeNav));

  // -------------------------------------------------------
  // Booking Bar
  // -------------------------------------------------------
  const bookingForm = document.getElementById('bookingBar');
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  const guestsSelect = document.getElementById('guests');

  if (bookingForm) {
    const todayStr = new Date().toISOString().split('T')[0];
    checkinInput.min = todayStr;

    checkinInput.addEventListener('change', () => {
      const nextDay = new Date(checkinInput.value);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split('T')[0];
      checkoutInput.min = nextDayStr;
      if (!checkoutInput.value || checkoutInput.value <= checkinInput.value) {
        checkoutInput.value = nextDayStr;
      }
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formatTr = (dateStr) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}.${m}.${y}`;
      };

      const checkin = formatTr(checkinInput.value);
      const checkout = formatTr(checkoutInput.value);
      const guests = guestsSelect.value;

      const message = `Merhaba, Odak Apart Otel'de müsaitlik sormak istiyorum.%0AGiriş: ${checkin}%0AÇıkış: ${checkout}%0AKişi Sayısı: ${guests}`;
      window.open(`https://wa.me/905307207171?text=${message}`, '_blank', 'noopener');
    });
  }

  // -------------------------------------------------------
  // Footer: güncel yıl
  // -------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
