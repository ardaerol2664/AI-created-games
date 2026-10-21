# AI-created-games

Her oyun, kaynak kodu ve çalıştırma yönergeleriyle birlikte ayrı bir klasörde tutulur.

| Oyun | Klasör | Açıklama |
| --- | --- | --- |
| 01 · Mini Mart — Tarladan Rafa | [01-mini-mart](01-mini-mart/) | Üretim, raf doldurma, satış ve çalışan yönetimi içeren Türkçe 3B tarayıcı oyunu. |
| 02 · Kor & Damla — Ateş ve Su | [02-ates-ve-su](02-ates-ve-su/) | Aynı fiziksel klavyede iki kişilik, altı özgün tapınak bölümü içeren 2B bulmaca ve platform oyunu. |

## İlk oyunu çalıştırma

Depoyu indirdikten sonra `01-mini-mart/dist/mini-mart-tek-dosya.html` dosyasını tarayıcıda açın. Bu dosya bütün oyun kodunu, 3B kütüphaneyi ve yazı tiplerini içerir.

Yerel sunucuyla çalıştırmak için:

```sh
python3 -m http.server 8080 --directory 01-mini-mart/dist
```

Ardından `http://localhost:8080` adresini açın.

[Ayrıntılı oyun yönergeleri](01-mini-mart/README.md) · [Araştırma](01-mini-mart/docs/RESEARCH.md) · [Doğrulama](01-mini-mart/docs/VALIDATION.md)

## Ateş ve Su oyununu çalıştırma

`02-ates-ve-su/dist/ates-ve-su-tek-dosya.html` dosyasını indirip tarayıcıda açın. İnternet veya kurulum gerektirmez. Kor için **ok tuşları**, Damla için **WASD** kullanılır; dokunmatik hareket kontrolü yoktur.

[Oyun ve Android Brave yönergeleri](02-ates-ve-su/README.md) · [Mekanik karşılaştırması ve kapsam](02-ates-ve-su/docs/RESEARCH.md) · [Test sonuçları](02-ates-ve-su/docs/VALIDATION.md)
