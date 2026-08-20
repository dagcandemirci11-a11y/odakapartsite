# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proje

Odak Apart Otel (Ayvalık Altınova) için tek sayfalık tanıtım + rezervasyon-yönlendirme sitesi. Türkçe içerik. Statik site: derleme adımı, paket yöneticisi veya sunucu **yok** — dosyalar doğrudan tarayıcıda çalışır.

- `index.html` — tüm sayfa içeriği (tek sayfa, bölümler `<section id="...">` ile)
- `css/style.css` — numaralandırılmış bölümlerden oluşan tek stil dosyası (`/* 1. ... 21. ... */`)
- `js/main.js` — tüm etkileşim (tek `DOMContentLoaded` bloğu)
- `assets/images/*.jpg` — **gerçek otel fotoğrafları** (hero, hikaye, mozaik, 9 daire tipinin tamamı). Birkaç eski SVG çizim (`room-*.svg`, `story.svg`, `og-image.svg`) hâlâ klasörde ama artık hiçbir yerde kullanılmıyor — silinebilir, düşük öncelikli temizlik.
- `robots.txt`, `sitemap.xml` — arama motoru keşfi için, repo kökünde.

## Yayında

- **Canlı adres:** https://odakapart.com (Netlify DNS ile bağlı)
- **Barındırma:** Netlify, proje adı `majestic-sunburst-9d562c` — `https://majestic-sunburst-9d562c.netlify.app` her zaman çalışan yedek adres
- **GitHub:** https://github.com/dagcandemirci11-a11y/odakapartsite (branch: `main`)
- **Dağıtım akışı tamamen otomatik:** `git push origin main` yapılan her şey birkaç saniye içinde Netlify tarafından otomatik canlıya alınır. Ayrı bir "deploy" adımı yok.
- SSH anahtarı bu makinede zaten kurulu ve GitHub'a tanımlı (`~/.ssh/id_ed25519`) — push için ekstra kimlik doğrulama gerekmez.

## Çalıştırma / önizleme

Derleme yok. Görüntülemek için `index.html`'i tarayıcıda aç. Testler ve lint yok.

Yerel önizleme (Claude Code'un tarayıcı panelinde) CSS/JS'i agresif cache'ler ve bazen dosyayı hiç yüklemeyebilir (nadir, araç kaynaklı bir arıza — kod sorunuyla karıştırma, önce sayfayı yeniden aç). **Her CSS/JS değişikliğinden sonra `index.html` içindeki `?v=N` sürüm numaralarını (hem `style.css?v=` hem `main.js?v=`) artır**, yoksa değişiklik görünmez.

## Mimari notlar

**Renk & tema — her şey CSS değişkeni üzerinden.** `:root` içinde tanımlı palet (bej/krem, sıcak ahşap tonları, gece mavisi/füme) ve ölçüler (`--radius-*`, `--shadow-*`, `--transition`). Yeni renk/gölge/boşluk üretme — mevcut token'ları kullan. Palet ve tipografi (başlık: Montserrat, gövde: Inter) bilinçli seçim; değiştirmeden önce sor.

**Bölüm ritmi.** Bölümler dönüşümlü zemin renkleriyle ayrılır (`--color-cream`, `--color-cream-light`, `--color-cream-dark`, hero/footer koyu). `.section-header` + `.eyebrow` (ahşap aksан çizgili) editoryal başlık deseni her bölümde tekrarlanır — yeni bölüm eklerken bu deseni izle.

**İkonlar inline SVG (Lucide tarzı, çizgi).** Emoji kullanma. Oda özellikleri `.spec-ico`, olanaklar `.amenity-icon svg` sınıflarıyla ahşap tonlu, `stroke`-tabanlı ikonlar kullanır. Yeni ikon eklerken bu stille tutarlı ol.

**Logo yok — bilinçli karar.** Header ve footer'da sadece "Odak Apart Otel / İkinci Eviniz" metni var, marka işareti/ikon yok. Daha önce gerçek tabela fotoğrafından kırpılmış bir logo denendi, kullanıcı isteğiyle kaldırıldı. Geri getirmeden önce sor. (Favicon'da hâlâ eski "OA" dairesi duruyor — bu kararla hafif çelişiyor ama düşük öncelikli, dokunulmadı.)

**JS deseni.** `main.js` tek `DOMContentLoaded` içinde sıralı bloklar: mobil nav, booking bar (WhatsApp'a yönlendirir — `wa.me/905307207171`), rezervasyon modalı (oda kartından tarih seçip fiyat hesaplayan ayrı bir akış, 15+ gecede %10 indirim uygular), oda galerileri (kaydırmalı, ok/nokta navigasyonlu), fotoğraf lightbox'ı (`.js-lightbox`), footer yılı, scroll-reveal + aktif nav vurgusu (IntersectionObserver), yukarı-çık butonu. Animasyonlar `prefers-reduced-motion`'a saygılı; **JS çalışmasa bile içerik gizli kalmamalı** (reveal öğeleri JS ile `.reveal` sınıfı alır, almazsa görünür kalır). Yeni bölüm reveal edilecekse `revealSelectors` dizisine, nav vurgusu gerekiyorsa `sections` dizisine ekle.

**Booking bar gerçek rezervasyon yapmaz** — formu WhatsApp mesajına çevirip açar. Backend yok. Rezervasyon modalındaki fiyat hesaplaması da sadece WhatsApp mesajına yazılıyor, gerçek bir ödeme/rezervasyon sistemi değil.

**Booking bar `.hero`'nun DIŞINDA, normal akışta** (`#hero` `</section>`'ından hemen sonra, ayrı bir `<div class="booking-bar-wrap">`). Eskiden `.hero`'nun çocuğuydu ve `transform: translateY(50%)` ile alt kenardan taşırılıyordu — bu, farklı cihazlarda iki ayrı regresyona yol açtı (kırpılma, sonra üstüne binme). **Bu deseni geri getirme** — booking bar'ı tekrar `position:absolute`/`transform` ile hero'ya taşırma; normal akış kalıcı ve cihazdan bağımsız güvenli çözümdür.

**Oda galerisi fotoğraf sırası kuralı.** Bir oda kartına fotoğraf galerisi eklerken (`.room-gallery`, `data-gallery`), **ilk fotoğraf her zaman oturma/salon alanı** olmalı — kullanıcının bilinçli tercihi. Yeni oda tiplerine fotoğraf eklerken bu sırayı koru.

**Kullanıcı görsel eklerken dosya adı hatası yapıyor (tekrarlayan desen).** Windows "Farklı Kaydet" penceresi genelde uzantıyı görmüyor/gizliyor; kullanıcı `foto.jpg` yazsa bile dosya `foto.jpg.jpg` olarak kaydediliyor. **Her yeni görsel eklemesinde önce `ls` ile gerçek dosya adını kontrol et**, çift uzantı varsa `mv` ile düzelt, sonra koda referans ver.

## Bekleyen işler (bu oturumda konuşuldu, henüz tamamlanmadı)

- **Google Search Console doğrulaması** — kullanıcı `search.google.com/search-console`'da `https://odakapart.com` mülkünü eklemeli, "HTML tag" doğrulama yöntemini seçip verilen `<meta name="google-site-verification" ...>` satırını bana vermeli. Ben `<head>`'e ekleyip push'larım.
- **Google İşletmem (Business Profile) pin doğrulaması** — kullanıcı işletmeyi claim/doğrulayıp haritadaki iğneyi tam giriş noktasına taşıyacak. Sonra bana o konumun Google Haritalar linkini/koordinatlarını verecek; ben Konum bölümündeki iframe embed'ini (`src="https://maps.google.com/maps?q=..."`) adres bazlı aramadan **kesin koordinata** çevireceğim.
- **Facebook linki** — footer'da hâlâ yok (kaldırılmıştı, kullanıcı "Facebook kullanmıyoruz" demişti — muhtemelen kalıcı, tekrar sorulmadan eklenmemeli).
- **Google puanı `4.2`** — kullanıcı tarafından **teyit edildi, gerçek**. Yorumlar da (Burak Yılmaz, Hakan Özdemir, Ayşe Korkmaz, Elif Demir, Mehmet Aydın, Emre Kaya, Zeynep Şahin) kullanıcının verdiği gerçek Google yorumlarının yazım/imla düzeltilmiş hali — uydurma değil, ama isim-yorum eşleşmeleri kullanıcı onayıyla rastgele atanmış (yorumlar gerçek, YAZAR İSİMLERİ rastgele).
- **Harita iğnesi** — yukarıdaki Business Profile maddesiyle bağlantılı, hâlâ adres bazlı arama embed'i kullanıyor, kesin pin değil.

## Dil

Tüm kullanıcıya görünen metin ve commit mesajları **Türkçe**.
