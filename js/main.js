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

    // Tarih alanları boşken "gg.aa.yyyy" metnini her tarayıcıda göstermek için
    // metin kutusu olarak başlar, odaklanınca tarih seçiciye dönüşürler.
    [checkinInput, checkoutInput].forEach((inp) => {
      inp.addEventListener('focus', () => {
        if (inp.type === 'text') {
          inp.type = 'date';
          if (typeof inp.showPicker === 'function') {
            try { inp.showPicker(); } catch (e) { /* kullanıcı yine de takvim ikonuna tıklayabilir */ }
          }
        }
      });
      inp.addEventListener('blur', () => {
        if (!inp.value) inp.type = 'text';
      });
    });

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

  // -------------------------------------------------------
  // Hareketi azalt tercihi
  // -------------------------------------------------------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------------------------------------------------------
  // Scroll-reveal: öğeler görünür alana girince belirir
  // -------------------------------------------------------
  const revealSelectors = [
    '.section-header', '.rooms-floor-title', '.room-card',
    '.amenity-card', '.review-card', '.rating-badge',
    '.location-info', '.location-map', '.rooms-info-band',
    '.distance-list li', '.location-address',
    '.story-media', '.story-content'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Animasyon yoksa her şey doğrudan görünür kalsın
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    revealEls.forEach(el => el.classList.add('reveal'));

    // Aynı grup içindeki kartlara kademeli gecikme (stagger)
    document.querySelectorAll('.rooms-grid, .amenities-grid, .reviews-grid').forEach(group => {
      [...group.children].forEach((child, i) => {
        if (child.classList.contains('reveal')) {
          child.style.transitionDelay = (i % 3) * 0.09 + 's';
        }
      });
    });

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // -------------------------------------------------------
  // Aktif menü vurgusu (kaydırdıkça bulunduğun bölüm)
  // -------------------------------------------------------
  const sections = ['hikaye', 'daireler', 'hizmetler', 'konum', 'iletisim']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.25, rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(sec => navObserver.observe(sec));
  }

  // -------------------------------------------------------
  // Yukarı çık butonu
  // -------------------------------------------------------
  const toTop = document.getElementById('toTop');
  if (toTop) {
    const onScrollTop = () => {
      toTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    onScrollTop();
    window.addEventListener('scroll', onScrollTop, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
});
