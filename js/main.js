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

      const message = `Merhaba, Odak Apart Otel'de müsaitlik sormak istiyorum.\nGiriş: ${checkin}\nÇıkış: ${checkout}\nKişi Sayısı: ${guests}`;
      window.open(`https://wa.me/905307207171?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
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
    '.location-info', '.location-map-wrap',
    '.distance-list li', '.location-address',
    '.story-media', '.story-content', '.faq-item', '.mosaic-item'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Animasyon yoksa her şey doğrudan görünür kalsın
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    revealEls.forEach(el => el.classList.add('reveal'));

    // Aynı grup içindeki kartlara kademeli gecikme (stagger)
    document.querySelectorAll('.rooms-grid, .amenities-grid, .reviews-grid, .mosaic-grid').forEach(group => {
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
  const sections = ['hikaye', 'daireler', 'hizmetler', 'konum', 'sss', 'iletisim']
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

  // -------------------------------------------------------
  // Rezervasyon modalı (oda kartından tarih seç + fiyat + indirim)
  // -------------------------------------------------------
  const modal = document.getElementById('reserveModal');
  if (modal) {
    const WA_NUMBER = '905307207171';
    const DISCOUNT_MIN_NIGHTS = 15;   // 15 gece ve üzeri
    const DISCOUNT_RATE = 0.10;       // %10

    const elTitle    = document.getElementById('reserveTitle');
    const elNightly  = document.getElementById('reserveNightly');
    const inCheckin  = document.getElementById('rCheckin');
    const inCheckout = document.getElementById('rCheckout');
    const inGuests   = document.getElementById('rGuests');
    const elSummary  = document.getElementById('reserveSummary');
    const elNights   = document.getElementById('reserveNights');
    const elBase     = document.getElementById('reserveBase');
    const elDiscRow  = document.getElementById('reserveDiscountRow');
    const elDiscAmt  = document.getElementById('reserveDiscountAmt');
    const elOldTotal = document.getElementById('reserveOldTotal');
    const elTotal    = document.getElementById('reserveTotal');
    const elPromoHint = document.getElementById('reservePromoHint');
    const elSubmit   = document.getElementById('reserveSubmit');

    let nightlyPrice = 0;
    let roomName = '';

    const fmt = (n) => n.toLocaleString('tr-TR') + ' ₺';
    const todayISO = () => new Date().toISOString().split('T')[0];
    const trDate = (iso) => { if (!iso) return ''; const [y,m,d] = iso.split('-'); return `${d}.${m}.${y}`; };

    // Tarih alanları: boşken metin, odakta tarih seçici (placeholder her tarayıcıda görünsün)
    [inCheckin, inCheckout].forEach((inp) => {
      inp.addEventListener('focus', () => {
        if (inp.type === 'text') {
          inp.type = 'date';
          if (typeof inp.showPicker === 'function') { try { inp.showPicker(); } catch (e) {} }
        }
      });
      inp.addEventListener('blur', () => { if (!inp.value) inp.type = 'text'; });
    });

    const openModal = (card) => {
      roomName = card.querySelector('.room-head h3').textContent.trim();
      const priceText = card.querySelector('.room-price strong').textContent;
      nightlyPrice = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;

      elTitle.textContent = roomName;
      elNightly.textContent = fmt(nightlyPrice);

      // sıfırla
      inCheckin.type = 'text'; inCheckin.value = '';
      inCheckout.type = 'text'; inCheckout.value = '';
      inCheckin.min = todayISO();
      elSummary.hidden = true;
      elSubmit.disabled = true;

      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.hidden = true;
      document.body.style.overflow = '';
    };

    const nightsBetween = () => {
      if (inCheckin.type !== 'date' || inCheckout.type !== 'date') return 0;
      if (!inCheckin.value || !inCheckout.value) return 0;
      const ci = new Date(inCheckin.value);
      const co = new Date(inCheckout.value);
      const diff = Math.round((co - ci) / 86400000);
      return diff > 0 ? diff : 0;
    };

    const updateSummary = () => {
      const nights = nightsBetween();
      if (nights <= 0) { elSummary.hidden = true; elSubmit.disabled = true; return; }

      const base = nights * nightlyPrice;
      const hasDiscount = nights >= DISCOUNT_MIN_NIGHTS;
      const discountAmt = hasDiscount ? Math.round(base * DISCOUNT_RATE) : 0;
      const total = base - discountAmt;

      elNights.textContent = `${nights} gece × ${fmt(nightlyPrice)}`;
      elBase.textContent = fmt(base);

      if (hasDiscount) {
        elDiscRow.hidden = false;
        elDiscAmt.textContent = '− ' + fmt(discountAmt);
        elOldTotal.hidden = false;
        elOldTotal.textContent = fmt(base);
        elPromoHint.hidden = false;
      } else {
        elDiscRow.hidden = true;
        elOldTotal.hidden = true;
        elPromoHint.hidden = true;
      }
      elTotal.textContent = fmt(total);

      elSummary.hidden = false;
      elSubmit.disabled = false;
    };

    // Giriş seçilince çıkışın alt sınırını ayarla
    inCheckin.addEventListener('change', () => {
      if (inCheckin.value) {
        const next = new Date(inCheckin.value);
        next.setDate(next.getDate() + 1);
        const nextISO = next.toISOString().split('T')[0];
        inCheckout.min = nextISO;
        if (inCheckout.type === 'date' && (!inCheckout.value || inCheckout.value <= inCheckin.value)) {
          inCheckout.value = nextISO;
        }
      }
      updateSummary();
    });
    inCheckout.addEventListener('change', updateSummary);

    // WhatsApp'a yönlendir (mesajda fiyat YOK)
    elSubmit.addEventListener('click', () => {
      const nights = nightsBetween();
      if (nights <= 0) return;

      const base = nights * nightlyPrice;
      const hasDiscount = nights >= DISCOUNT_MIN_NIGHTS;
      const total = hasDiscount ? Math.round(base * (1 - DISCOUNT_RATE)) : base;

      const priceLine = hasDiscount
        ? `Toplam Fiyat: ${fmt(total)} (%10 uzun konaklama indirimli, normali ${fmt(base)})`
        : `Toplam Fiyat: ${fmt(total)}`;

      const msg = `Merhaba, Odak Apart Otel'de rezervasyon yapmak istiyorum.\nDaire: ${roomName}\nGiriş: ${trDate(inCheckin.value)}\nÇıkış: ${trDate(inCheckout.value)}\nGece: ${nights}\nKişi Sayısı: ${inGuests.value}\n${priceLine}`;
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    });

    // Kart butonlarını bağla
    document.querySelectorAll('.js-reserve').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.room-card');
        if (card) openModal(card);
      });
    });

    // Kapatma: overlay, çarpı, Escape
    modal.querySelectorAll('[data-reserve-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  }

  // -------------------------------------------------------
  // Oda galerileri: kaydırınca aktif nokta güncellensin
  // (ayrı sekme/lightbox yok, sadece parmak/fare ile kaydırma)
  // -------------------------------------------------------
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const track = gallery.querySelector('.room-gallery-track');
    const dots = gallery.querySelectorAll('.room-gallery-dots span');
    const prevBtn = gallery.querySelector('.room-gallery-prev');
    const nextBtn = gallery.querySelector('.room-gallery-next');
    if (!track || !dots.length) return;

    const updateUI = () => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      if (prevBtn) prevBtn.classList.toggle('is-disabled', index === 0);
      if (nextBtn) nextBtn.classList.toggle('is-disabled', index === dots.length - 1);
    };

    let ticking = false;
    track.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { updateUI(); ticking = false; });
    }, { passive: true });

    [prevBtn, nextBtn].forEach((btn) => {
      if (!btn) return;
      btn.addEventListener('click', () => {
        track.scrollBy({ left: track.clientWidth * Number(btn.dataset.dir), behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    updateUI();
  });
});
