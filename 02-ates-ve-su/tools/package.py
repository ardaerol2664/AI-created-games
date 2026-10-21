"""Build a dependency-free offline HTML and a portable, reproducible source ZIP."""
from pathlib import Path
import re
import urllib.parse
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
page = (DIST / 'index.html').read_text()
page = page.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + (DIST / 'style.css').read_text() + '\n</style>')
for name in ['levels.js', 'engine.js', 'art.js', 'game.js']:
    js = (DIST / name).read_text().replace('</script', '<\\/script')
    page = page.replace('<script defer src="' + name + '"></script>', '<script defer>\n' + js + '\n</script>')
# Defer only works on external classic scripts. Inline scripts belong after the DOM.
scripts = re.findall(r'<script defer>.*?</script>', page, flags=re.S)
page = re.sub(r'\s*<script defer>.*?</script>', '', page, flags=re.S)
page = page.replace('</body>', '\n' + '\n'.join(s.replace('<script defer>', '<script>') for s in scripts) + '\n</body>')
icon = urllib.parse.quote((DIST / 'icon.svg').read_text())
page = page.replace('href="icon.svg"', 'href="data:image/svg+xml,' + icon + '"')
out = DIST / 'ates-ve-su-tek-dosya.html'
out.write_text(page)
archive = DIST / 'ates-ve-su-kaynak-kodu.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
    license_item = zipfile.ZipInfo('LICENSE', (2026, 1, 1, 0, 0, 0))
    license_item.compress_type = zipfile.ZIP_DEFLATED
    license_item.external_attr = 0o644 << 16
    z.writestr(license_item, (ROOT.parent / 'LICENSE').read_bytes())
    for p in sorted(ROOT.rglob('*')):
        if not p.is_file() or p == archive or any(part in ['node_modules', '__pycache__', '.openai'] for part in p.parts):
            continue
        item = zipfile.ZipInfo(str(Path('02-ates-ve-su') / p.relative_to(ROOT)), (2026, 1, 1, 0, 0, 0))
        item.compress_type = zipfile.ZIP_DEFLATED
        item.external_attr = 0o644 << 16
        z.writestr(item, p.read_bytes())
print(f'{out.name}: {out.stat().st_size:,} bytes')
print(f'{archive.name}: {archive.stat().st_size:,} bytes')
