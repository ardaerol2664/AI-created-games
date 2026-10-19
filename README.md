# AI-created-games

Her oyun, kaynak kodu ve çalıştırma yönergeleriyle birlikte ayrı bir klasörde tutulur.

| Oyun | Klasör | Açıklama |
| --- | --- | --- |
| 01 · Mini Mart — Tarladan Rafa | [01-mini-mart](01-mini-mart/) | Üretim, raf doldurma, satış ve çalışan yönetimi içeren Türkçe 3B tarayıcı oyunu. |

## İlk oyunu çalıştırma

Depoyu indirdikten sonra `01-mini-mart/dist/mini-mart-tek-dosya.html` dosyasını tarayıcıda açın. Bu dosya bütün oyun kodunu, 3B kütüphaneyi ve yazı tiplerini içerir.

Yerel sunucuyla çalıştırmak için:

```sh
python3 -m http.server 8080 --directory 01-mini-mart/dist
```

Ardından `http://localhost:8080` adresini açın.

[Ayrıntılı oyun yönergeleri](01-mini-mart/README.md) · [Araştırma](01-mini-mart/docs/RESEARCH.md) · [Doğrulama](01-mini-mart/docs/VALIDATION.md)
