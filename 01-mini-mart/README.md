# 01 · Mini Mart — Tarladan Rafa

My Mini Mart'ın temel üretim, taşıma ve satış döngüsünü yeniden kuran, Türkçe arayüzlü bağımsız bir 3B tarayıcı oyunu. Oyun mantığı ve 3B modeller bu proje için sıfırdan yazıldı. Orijinal oyunun kodu, modelleri, müziği veya görselleri kullanılmadı.

## Çalıştırma

`dist/mini-mart-tek-dosya.html` dosyasını indirip güncel Chrome, Edge, Firefox veya Safari'de açın. Kaynak klasörüyle çalışırken `dist/index.html` dosyasını da açabilirsiniz. Kurulum, hesap veya internet bağlantısı gerekmez. WebGL destekli bir tarayıcı gerekir.

İsteğe bağlı yerel sunucu:

```sh
python3 -m http.server 8080 --directory dist
```

Ardından `http://localhost:8080` adresini açın. Kayıtlar tarayıcıya ve adrese bağlıdır; dosya olarak açılan sürüm ile localhost sürümünün kayıtları ayrı olabilir.

## Oynanış

- **Yürüme:** WASD / ok tuşları, yere tıklama veya mobil joystick.
- **Hasat:** Bahçenin önündeki halkada bekleyin. Domatesler çantaya dolar.
- **Raf doldurma:** Uygun rafın arkasındaki halkada bekleyin.
- **Satış:** Kasanın arkasındaki halkada bekleyin. Müşteriler sırayla ödeme yapar; para otomatik toplanır.
- **Yumurta ve süt:** İlgili alanı açın, hayvanlara domates götürün. Domatesler yem olarak kullanılır. Üretilen ürünü alıp rafa taşıyın.
- **Meyve suyu:** Domatesleri makineye götürün, çıkan ürünü rafa taşıyın.
- **Çalışanlar:** Kasiyer otomatik satış yapar, kasada para birikir. Raf görevlisi ürün toplar, hayvanları besler ve rafları doldurur.
- **Geri dönüşüm:** Çantayı boşaltmak için çöp kutusunun yanındaki küçük halkada bekleyin.
- **P:** Duraklat / devam et. **Esc:** Pencereyi kapat / duraklat.

## İçerik

4 ürün (domates, yumurta, süt, meyve suyu), 4 üretim alanı, 4 raf, kasiyer ve raf görevlisi, 11 aşamalı hedef zinciri, 4 kademeli hız/kapasite/üretim/fiyat yükseltmeleri, müşteri kuyruğu, otomatik kayıt, isteğe bağlı sentezlenmiş ses efektleri ve hareketli 3B sahne.

Bu sürüm tek bir markette tamamlanabilir bir ilerleme döngüsüdür. Ticari oyunun bütün haritalarını ve ürün kataloğunu içermez. Reklamlar, satın almalar ve orijinal oyunun çevrim içi hizmetleri yoktur.

## Dosyalar

- `dist/mini-mart-tek-dosya.html`: Bütün kod, 3B kütüphane ve yazı tiplerini içinde barındıran tek dosyalık çevrim dışı sürüm.
- `dist/mini-mart-kaynak-kodu.zip`: Taşınabilir kaynak paketi.
- `tools/package.py`: HTML ve kaynak paketini yeniden üretir (`python3 tools/package.py`).

- `dist/index.html`: Arayüz ve açılış dosyası.
- `dist/game.js`: Oyun mantığı, 3B modeller, ekonomi, yol bulma, kayıt ve kontrol sistemi.
- `dist/style.css`: Masaüstü ve mobil arayüz.
- `dist/vendor/`: Yerel Three.js ve yazı tipleri; lisansları yanlarındadır.
- `docs/RESEARCH.md`: Araştırma kaynakları ve uyarlama kararları.
- `docs/VALIDATION.md`: Yapılan doğrulamalar ve sınırlar.

## Teknik yaklaşım

Three.js 0.160.1, WebGL ve standart HTML/CSS/JavaScript kullanılır. Kurulum veya derleme adımı yoktur. Statik geometriler malzemeye göre birleştirilir, geometriler ve malzemeler önbelleklenir. Müşteri ve parçacık sayıları sınırlandırılır. A* yol bulma yalnızca hedef değiştiğinde çalışır. Ekran piksel oranı sınırlandırılır; otomatik kalite düşük kare hızında çözünürlüğü azaltır. Görünmeyen sekmede simülasyon durur. Kayıt her 4 saniyede ve önemli işlemlerde yapılır.

Kayıt anahtarı: `mini-mart-original-v1`. Ayarlardaki iki aşamalı “Yeni başlangıç” düğmesi yalnızca bu oyunun kaydını sıfırlar.

Bu klasör ilk oyuna ayrılmıştır. Sonraki oyunlar üst dizinde `02-oyun-adi`, `03-oyun-adi` gibi ayrı klasörlerde oluşturulmalıdır.
