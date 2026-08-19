# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proje

Odak Apart Otel (Ayvalık Altınova) için tek sayfalık tanıtım + rezervasyon-yönlendirme sitesi. Türkçe içerik. Statik site: derleme adımı, paket yöneticisi veya sunucu **yok** — üç dosya doğrudan tarayıcıda çalışır.

- `index.html` — tüm sayfa içeriği (tek sayfa, bölümler `<section id="...">` ile)
- `css/style.css` — numaralandırılmış bölümlerden oluşan tek stil dosyası (`/* 1. ... 18. ... */`)
- `js/main.js` — tüm etkileşim (tek `DOMContentLoaded` bloğu)
- `assets/images/*.svg` — oda/hikaye için **geçici örnek görseller**; gerçek fotoğraflar geldiğinde `<img src>` değiştirilecek

## Çalıştırma / önizleme

Derleme yok. Görüntülemek için `index.html`'i tarayıcıda aç. Testler ve lint yok.

Bu depoda önizleme, tarayıcı **statik snapshot** olarak yüklendiği için CSS/JS'i agresif cache'ler. **Değişiklikten sonra `index.html` içindeki `css/style.css?v=N` sürüm numarasını artır**, yoksa yeni CSS görünmez. (JS için de aynı desen gerekirse uygulanabilir.) `git` bilgisayarda kurulu; commit'ler yerel (henüz uzak/remote yok).

## Mimari notlar

**Renk & tema — her şey CSS değişkeni üzerinden.** `:root` içinde tanımlı palet (bej/krem, sıcak ahşap tonları, gece mavisi/füme) ve ölçüler (`--radius-*`, `--shadow-*`, `--transition`). Yeni renk/gölge/boşluk üretme — mevcut token'ları kullan. Palet ve tipografi (başlık: Montserrat, gövde: Inter) bilinçli seçim; değiştirmeden önce sor.

**Bölüm ritmi.** Bölümler dönüşümlü zemin renkleriyle ayrılır (`--color-cream`, `--color-cream-light`, `--color-cream-dark`, hero/footer koyu). `.section-header` + `.eyebrow` (ahşap aksан çizgili) editoryal başlık deseni her bölümde tekrarlanır — yeni bölüm eklerken bu deseni izle.

**İkonlar inline SVG (Lucide tarzı, çizgi).** Emoji kullanma. Oda özellikleri `.spec-ico`, olanaklar `.amenity-icon svg` sınıflarıyla ahşap tonlu, `stroke`-tabanlı ikonlar kullanır. Yeni ikon eklerken bu stille tutarlı ol.

**JS deseni.** `main.js` tek `DOMContentLoaded` içinde sıralı bloklar: mobil nav, booking bar (WhatsApp'a yönlendirir — `wa.me/905307207171`), footer yılı, scroll-reveal + aktif nav vurgusu (IntersectionObserver), yukarı-çık butonu. Animasyonlar `prefers-reduced-motion`'a saygılı; **JS çalışmasa bile içerik gizli kalmamalı** (reveal öğeleri JS ile `.reveal` sınıfı alır, almazsa görünür kalır). Yeni bölüm reveal edilecekse `revealSelectors` dizisine, nav vurgusu gerekiyorsa `sections` dizisine ekle.

**Booking bar gerçek rezervasyon yapmaz** — formu WhatsApp mesajına çevirip açar. Backend yok.

**Booking bar artık `.hero`'nun DIŞINDA, normal akışta** (`#hero` `</section>`'ından hemen sonra, ayrı bir `<div class="booking-bar-wrap">`). Eskiden `.hero`'nun çocuğuydu ve `transform: translateY(50%)` ile alt kenardan taşırılıyordu — bu, farklı cihazlarda iki ayrı regresyona yol açtı (kırpılma, sonra üstüne binme). **Bu deseni geri getirme** — booking bar'ı tekrar `position:absolute`/`transform` ile hero'ya taşırma; normal akış kalıcı ve cihazdan bağımsız güvenli çözümdür. Tarih alanları `type="text"` başlar, odakta `type="date"`'e döner (placeholder her tarayıcıda görünsün diye).

**Oda galerisi fotoğraf sırası kuralı.** Bir oda kartına gerçek fotoğraf galerisi eklerken (`.room-gallery`, `data-gallery`), **ilk fotoğraf her zaman oturma/salon alanı** olmalı — bu, kullanıcının bilinçli tercihi (1+0 dairelerde uygulandı: oturma → mutfak → yatak). Yeni oda tiplerine fotoğraf eklerken bu sırayı koru.

## İçerik durumu (placeholder'lar)

Yayına almadan gerçeğiyle değiştirilecekler: oda/hikaye fotoğrafları (şu an SVG çizim), Google puanı (`4.2`), harita iğnesi (adrese göre embed), Facebook linki (`#`). Instagram bağlı. Oda dökümü toplam **27** (9 tip, kat kat gruplu) — bu toplamı bozacak değişikliklerde dikkatli ol.

## Dil

Tüm kullanıcıya görünen metin ve commit mesajları **Türkçe**.
