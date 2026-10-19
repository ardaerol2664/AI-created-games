# Doğrulama

19 Ekim 2026, Chromium / Playwright.

## Geçen kontroller

- JavaScript sözdizimi kontrolü.
- 3B sahnenin WebGL ile oluşturulması; masaüstü ve 390 × 844 mobil ekran görüntüleri.
- Tıklayarak tezgâhların çevresinden yürüme ve domates toplama.
- Çanta kapasitesi, doğru rafa ürün bırakma ve stok artışı.
- Müşteri alışverişi, kasa kuyruğu, ödeme ve paranın toplanması.
- Görev ödülleriyle kümes açma; domates yeminden yumurta üretimi.
- Duraklatıldığında satış ve üretimin ilerlememesi.
- Kaydedilen ilerlemenin sayfa yenilemesinden sonra yüklenmesi.
- İleri aşama başlangıcında süt ve meyve suyu üretimi.
- Kasiyerin otomatik satış yapması ve raftan sorumlu çalışanın ürün taşıması.
- Kapasite yükseltmesinin doğru tutarı düşürmesi.
- Mobil görünümde yatay sayfa taşması olmaması.
- Gerçek pointer olaylarıyla joystick hareketi ve kameranın karakteri izlemesi.
- Marketi sıfırlamada para, çanta, satış, çalışanlar ve açılan alanların başlangıç durumuna dönmesi.

İleri aşama otomasyon testinde 45 saniye simülasyon sonunda 6 satış ve çalışan tarafından 28 ürün yerleştirme gözlendi. Müşteri seçimleri rastgele olduğundan bu değerler bir performans veya kazanç garantisi değildir.

## Test yöntemi ve sınırlar

Uzun oynanış testleri Playwright'ın kontrollü saatiyle çalıştırıldı. Simülasyon testleri sırasında tekrar eden WebGL çizimi devre dışı bırakıldı; görsel doğrulama için gerçek WebGL çizimi yeniden açıldı. Böylece oyun mantığı, bu ortamın yazılımsal grafik hızından bağımsız sınandı. Görsel kontrol performans modunda yapıldı.

Gerçek telefon donanımında ve Safari/Firefox'ta ölçüm yapılmadı. 60 FPS garantisi verilmez. Otomatik kalite, yazılımsal GPU algılama, çözünürlük sınırı ve performans ayarı bu farklılıkları azaltır. Uygulama çevrim dışı gelir hesaplamaz; kapalı veya görünmeyen sekmede üretim durur.

Araştırma ve kapsam sınırları için RESEARCH.md dosyasına bakın.

Bu ortamın tarayıcı yönetim ilkesi `file://` gezinmesini engellediğinden doğrudan dosya açılışı burada sınanamadı. Tek HTML sürümü yerel HTTP üzerinden, ek ağ istekleri engellenerek başarıyla kontrol edildi; tüm bağımlılıklar dosyanın içindedir.
