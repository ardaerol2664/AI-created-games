# Proje bağlamı

## Amaç ve kullanıcı beklentisi

Bu depoda, internetteki oyunları referans alarak birden fazla oyun yeniden üretilecek. Kullanıcıyla iletişim dili Türkçedir. Her oyun için referans ve özel istekler kullanıcı tarafından iletildikçe kapsam netleştirilir.

Mümkün olduğunda önce referans oyuna tarayıcıdan girilir, oyun bizzat oynanır ve notlar alınır; ardından uygulamaya geçilir. Yalnızca ekran görüntüsünden veya genel tür bilgisinden hareketle oynanışın doğrulandığı varsayılmaz. Doğrudan deneyim, kaynaklardan edinilen bilgi ve çıkarımlar belgelerde ayrı belirtilir. Erişim mümkün değilse engel ve kullanılan alternatif kaynaklar açıkça yazılır.

## Her oyun için çalışma akışı

1. Kullanıcının verdiği oyun bağlantısını ve beklentileri incele; hedef platformu, kontrolleri ve yeniden üretilecek kapsamı belirle. Eksik ayrıntılar için mevcut bağlamdan yararlan; kapsamı belirleyen belirsizlikleri sor.
2. Erişim ve araçlar elveriyorsa referans oyunu oyna. Ana oyun döngüsü, kurallar, hareket ve fizik, kamera, arayüz, ilerleme, ekonomi, kazanma/kaybetme koşulları, görsel ve ses geri bildirimleri hakkında not tut. İlgili ekran görüntülerini ve kaynak bağlantılarını kaydet.
3. Gözlemleri `docs/RESEARCH.md` içinde belgele. Uygulanacak özellikleri, önemli farkları ve henüz doğrulanamayan davranışları belirt.
4. Önce oynanabilir temel döngüyü kur; ardından içerik, arayüz ve görsel ayrıntıları ekle. Referansın kaynak koduna veya varlıklarına ihtiyaç duymadan, gözlemlenen davranışları kendi uygulamamızla üret.
5. Oyun akışını ve kontrolleri tarayıcıda sınamaya çalış; değişikliğe uygun testleri çalıştır. Referansla farkları ve gerçek cihazda doğrulanmayan noktaları `docs/VALIDATION.md` içinde kaydet. Emülasyonu gerçek cihaz testi olarak sunma.
6. Her anlamlı aşamada belgeleri ve çalıştırma yönergelerini güncelle, açıklayıcı bir commit oluştur ve mevcut GitHub deposuna push et. Araştırma, oynanabilir prototip, içerik/görsel geliştirme ve doğrulama ayrı aşamalar olabilir. Push başarısızsa yerel commit ile GitHub'a yüklenmiş durumu ayırt et ve engeli bildir.

## Depo düzeni

- GitHub: https://github.com/ardaerol2664/AI-created-games
- Her oyun numaralı, bağımsız bir klasörde tutulur; mevcut oyunların dosyaları korunur.
- `01-mini-mart/`: Mini Mart — Tarladan Rafa.
- `02-ates-ve-su/`: Kor & Damla — Ateş ve Su.
- Sonraki oyun için mevcut numaralar kontrol edilerek yeni klasör açılır; bugünkü düzende sıradaki numara `03` olur.
- Her oyun kendi `README.md`, kaynakları ve araştırma/doğrulama belgelerini içerir. Teknoloji ve dağıtım biçimi oyunun gereksinimlerine göre seçilir; mevcut oyunlar tarayıcı tabanlıdır.
- Kök `README.md` oyun kataloğu ve ilgili belgelere giriş noktasıdır.

## Bu aşamanın kapsamı

7 Kasım 2026 tarihinde kullanıcı yalnızca proje bağlamının oluşturulmasını istedi. Bu talep yeni bir oyunun geliştirilmesini veya mevcut oyunların değiştirilmesini içermiyor. Sıradaki oyun ve referans bağlantısı henüz bu görüşmede verilmedi. Mevcut iki oyunun durumu kendi belgelerinde kayıtlıdır; bu bağlamın hazırlanması sırasında oyunlar yeniden test edilmedi.
