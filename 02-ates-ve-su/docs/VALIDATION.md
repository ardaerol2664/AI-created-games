# Doğrulama

21 Ekim 2026 — Node.js, Playwright ve sistem Chromium'u.

## Fizik ve bölüm testleri

`node --test tests/engine.test.cjs`: **23/23 geçti.**

Altı bölümün tamamında kontrolcü yalnız hareket, zıplama ve kol komutları gönderdi. Karakter konumları değiştirilmedi; kapılar, elmaslar, sandıklar veya bölüm durumu test tarafından açılmadı. Hareket boyunca katı cisimlerle iç içe geçme kontrol edildi. Bütün bölümler 8/8 elmas ve üç yıldızla tamamlandı:

| Bölüm | Simülasyon süresi | Elmas | Yıldız |
| --- | --- | --- | --- |
| 1 | 12,52 sn | 8/8 | 3 |
| 2 | 12,52 sn | 8/8 | 3 |
| 3 | 12,69 sn | 8/8 | 3 |
| 4 | 15,60 sn | 8/8 | 3 |
| 5 | 15,77 sn | 8/8 | 3 |
| 6 | 15,77 sn | 8/8 | 3 |

Bu süreler otomatik kontrolcünün simülasyon süreleridir; insan bitirme süresi veya telefon performans ölçümü değildir.

Diğer testler eşzamanlı ters yön kontrolünü, basılı tutulan tuşla uçulamamasını, kısa sıçramayı, altı element–havuz eşleşmesini, yanlış renkli elmasları, iki kapı koşulunu, kolun tek basışta bir kez dönmesini, düğmenin bırakılmasını, kapanan geçidin oyuncuyu sıkıştırmamasını, kapalı geçidin atlanamamasını, bitmiş simülasyonun durmasını ve bölüm örneklerinin birbirinden bağımsızlığını kapsar. Bu küçük mekanik testlerinde belirli senaryoları kurmak için konum ayarı yapılır; altı tam bölüm testinde yapılmaz.

## Tarayıcı kontrolleri

`node tests/browser.test.cjs`: **31/31 kontrol geçti.**

- Masaüstünde gerçek klavye olaylarıyla aynı anda WASD ve ok tuşları, iki karakterin zıplaması.
- Ölüm, tekrar deneme, R ile sıfırlama, Esc ile duraklatma ve devam etme.
- Duraklama sırasında simülasyon saatinin sabit kalması.
- Yardım penceresi, kilitli bölüm menüsü ve ses açma.
- Tam ekran ve F ile çıkış.
- İlk bölümün normal fizik kontrolcüsüyle oynatılıp son adımın gerçek klavye olayına bırakılması; oyun arayüzünden zafer, kayıt ve sonraki bölümün açılması.
- Sayfa yenilemesinden sonra bölüm kilidi ve kayıt kalıcılığı.
- Android kullanıcı aracısı, dokunma destekli Chromium emülasyonu: **915 × 412** yatay ve **393 × 851** dikey ekranlarda yatay sayfa taşması yok; fiziksel klavye olayları ve yardım menüsü çalışıyor.
- Android yatay emülasyonunda F ile tam ekran; kanvas görünür ekran sınırları içinde kalıyor.
- Tek HTML sürümü, bütün ek istekler engellenirken HTTP üzerinden çalışıyor; sıfır ek ağ kaynağı.
- `localStorage` erişimi engellendiğinde başlangıçta hata yok.
- Kontrol edilen sayfalarda JavaScript çalışma zamanı hatası yok.

## Bulunan ve düzeltilen sorunlar

- İleri bölümlerde ardışık havuzlar arasında dar iniş alanları: Havuz konumları ve genişlikleri düzenlendi.
- Kapalı geçit üzerinden atlayarak bulmacayı geçersiz kılma: Geçitler tavana bağlandı veya zıplama yüksekliğinden uzun yapıldı.
- Son iki bölümde elmasın zehir üzerinde kalması: Elmas güvenli iniş alanına taşındı; bütün elmaslarla bölüm bitirme testi geçti.
- Kapının kenarına değmenin bitiş sayılması: Karakterin kapının içine girmesi zorunlu kılındı.
- Bazı sistem yazı tiplerinde köşegen okların boş kutu görünmesi: Vektör simgelerle değiştirildi.

Her ilgili düzeltmeden sonra başarısız kontrol ve gerekli testler tekrar çalıştırıldı. Son koşuda başarısız test kalmadı.

## Sınırlar

Gerçek Android Brave cihazı, Bluetooth / USB klavye, Android dosya yöneticilerinin `content://` açılışı ve gerçek cihaz FPS/batarya kullanımı sınanmadı. Chromium emülasyonu bu doğrulamaların yerine geçmez.

Ortamın tarayıcı yönetim ilkesi `file://` gezinmesini `ERR_BLOCKED_BY_ADMINISTRATOR` ile engelledi. Bu kural aşılmadı. Doğrudan dosya açılışı burada doğrulanamadı; tek HTML, ek ağ istekleri tamamen engellenerek HTTP üzerinden sınandı.

Orijinal oyunun belirli sürümüyle yan yana piksel, harita geometrisi veya fizik katsayısı karşılaştırması yapılmadı. Testler bu altı özgün bölümün işlevini doğrular; bütün olası hataların yokluğunu kanıtlamaz.
