/* Original level layouts. Coordinates are in the 1200 × 660 world. */
(function (root) {
  'use strict';
  function level(id, name, subtitle, features = {}) {
    const pools = [
      { x: 310, y: 594, w: id >= 5 ? 80 : 100, h: 22, type: 'water' },
      { x: id >= 5 ? 500 : 520, y: 594, w: id >= 5 ? 80 : 100, h: 22, type: 'fire' },
      { x: id >= 5 ? 850 : 800, y: 594, w: 90, h: 22, type: 'poison' },
      ...(features.pools || [])
    ];
    const cuts = pools.filter(p => p.y === 594).sort((a, b) => a.x - b.x);
    const platforms = [{ x: 24, y: 616, w: 1152, h: 44 }];
    let edge = 24;
    for (const p of cuts) { platforms.push({ x: edge, y: 594, w: p.x - edge, h: 22 }); edge = p.x + p.w; }
    platforms.push({ x: edge, y: 594, w: 1176 - edge, h: 22 });
    platforms.push(
      { x: 1080, y: 508, w: 96, h: 22 },
      { x: 108, y: 422, w: 936, h: 24 },
      { x: 108, y: 330, w: 98, h: 22 },
      { x: 244, y: 238, w: 932, h: 26 }
    );
    if (features.lift) {
      // The lift is the only route across a deliberately removed upper stair.
      platforms.splice(platforms.findIndex(p => p.y === 330), 1);
    }
    const gems = [
      { x: 265, y: 564, type: 'fire' }, { x: 460, y: 564, type: 'water' },
      { x: id >= 5 ? 800 : 710, y: 564, type: 'fire' }, { x: 990, y: 564, type: 'water' },
      { x: 860, y: 390, type: 'fire' }, { x: 450, y: 390, type: 'water' },
      { x: 420, y: 206, type: 'fire' }, { x: 690, y: 206, type: 'water' }
    ];
    return {
      id, name, subtitle, par: 95 + id * 12, platforms, pools, gems,
      spawn: [{ x: 100, y: 554, type: 'fire' }, { x: 160, y: 554, type: 'water' }],
      doors: [{ x: 1000, y: 162, w: 48, h: 76, type: 'fire' }, { x: 1090, y: 162, w: 48, h: 76, type: 'water' }],
      levers: features.lever ? [{ id: 'sun', x: 970, y: 422, on: false }] : [],
      plates: features.plate ? [{ id: 'moon', x: 897, y: 416, w: 62, h: 6 }] : [],
      gates: features.lever || features.plate ? [{ x: 748, y: 264, w: 24, h: 158, control: features.plate ? 'moon' : 'sun' }] : [],
      crates: features.plate ? [{ x: 984, y: 376, w: 42, h: 46 }] : [],
      lifts: features.lift ? [{ x: 114, y: 330, w: 80, h: 16, from: 330, to: 424, speed: 0.52 }] : [],
      ...features.extra
    };
  }
  const levels = [
    level(1, 'Yosunlu Eşik', 'İki element, tek yol. Birlikte çıkışa ulaşın.'),
    level(2, 'Güneşin Kolu', 'Kolu aşağı tuşuyla çevirin; taş geçidi açın.', { lever: true }),
    level(3, 'Ayın Ağırlığı', 'Sandığı düğmeye itin. Geçit açık kalsın.', { plate: true }),
    level(4, 'Yükselen Taş', 'Soldaki hareketli taşı bekleyin, yukarıya çıkın.', { lever: true, lift: true }),
    level(5, 'Zehirli Sessizlik', 'Yeşil havuz ikiniz için de tehlikeli.', { plate: true, pools: [{ x: 680, y: 594, w: 80, h: 22, type: 'poison' }], lift: true }),
    level(6, 'İki Işığın Tapınağı', 'Öğrendiklerinizi birleştirin. Son kapı sizi bekliyor.', { plate: true, lift: true,
      pools: [{ x: 680, y: 594, w: 80, h: 22, type: 'poison' }],
      extra: {
        levers: [{ id: 'sun', x: 605, y: 238, on: false }],
        gates: [{ x: 748, y: 264, w: 24, h: 158, control: 'moon' }, { x: 872, y: 96, w: 24, h: 142, control: 'sun' }]
      }
    })
  ];
  root.TempleLevels = levels;
  if (typeof module !== 'undefined' && module.exports) module.exports = levels;
})(globalThis);
