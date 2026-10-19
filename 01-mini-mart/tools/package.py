"""Build a fully standalone HTML and a portable source archive; no build dependencies."""
from pathlib import Path
import base64, re, zipfile
root=Path(__file__).resolve().parent.parent
dist=root/'dist'
css=(dist/'style.css').read_text()
def embed_font(m):
    data=base64.b64encode((dist/m.group(1)).read_bytes()).decode()
    return "url('data:font/ttf;base64,"+data+"')"
css=re.sub(r"url\('(vendor/[^']+\.ttf)'\)",embed_font,css)
html=(dist/'index.html').read_text().replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>')
for src in ['vendor/three.min.js','game.js']:
    js=(dist/src).read_text().replace('</script','<\\/script')
    html=html.replace('<script src="'+src+'"></script>','<script>'+js+'</script>')
standalone=dist/'mini-mart-tek-dosya.html'
standalone.write_text(html)
archive=dist/'mini-mart-kaynak-kodu.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(root.rglob('*')):
        if not p.is_file() or p==archive or '.openai' in p.parts or '.git' in p.parts:continue
        z.write(p,Path('01-mini-mart')/p.relative_to(root))
print('Standalone HTML:',standalone.stat().st_size,'bytes')
print('Source ZIP:',archive.stat().st_size,'bytes')
