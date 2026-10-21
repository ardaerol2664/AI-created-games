(function () {
  'use strict';
  const $ = id => document.getElementById(id), { World, DT } = TempleEngine, levels = TempleLevels;
  const KEY = 'kor-damla-progress-v1', keys = new Set();
  let progress={unlocked:1,best:{},sound:false}, world,renderer,levelIndex=0,paused=false,modalType=null,lastTime=0,accumulator=0,audio=null,toastTimer=0;
  try { const data=JSON.parse(localStorage.getItem(KEY)); if(data&&typeof data==='object'){
    progress.unlocked=Math.min(6,Math.max(1,Math.floor(Number(data.unlocked))||1));
    if(data.best&&typeof data.best==='object')for(const [key,value] of Object.entries(data.best))if(/^[1-6]$/.test(key)&&value&&Number.isFinite(value.time)&&Number.isFinite(value.stars))progress.best[key]={time:Math.max(0,value.time),stars:Math.min(3,Math.max(1,value.stars))};
    progress.sound=!!data.sound;
  }}catch{/* Private browsing or disabled storage still permits play. */}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{}};
  const fmt=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
  const svg=name=>`<svg aria-hidden="true"><use href="#${name}"/></svg>`;
  function tone(freq,duration=.1,type='sine',gain=.04){
    if(!progress.sound)return;
    try{
      if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();
      const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.65,audio.currentTime+duration);g.gain.setValueAtTime(gain,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration);
    }catch{/* A browser without Web Audio can still run the game. */}
  }
  function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3200);}
  function updateSound(){const b=$('sound-button');b.classList.toggle('muted',!progress.sound);b.setAttribute('aria-pressed',String(progress.sound));b.setAttribute('aria-label',progress.sound?'Sesi kapat':'Sesi aç');b.title=progress.sound?'Sesi kapat (M)':'Sesi aç (M)';}
  function toggleSound(){progress.sound=!progress.sound;updateSound();save();tone(440,.15);toast(progress.sound?'Tapınağın sesleri açık.':'Ses kapalı.');}
  function updateSteps(){
    $('level-steps').innerHTML=levels.map((l,i)=>`<button class="level-step ${i===levelIndex?'current':''} ${progress.best[l.id]?'complete':''}" data-level="${i}" ${l.id>progress.unlocked?'disabled':''} aria-label="Bölüm ${l.id}: ${l.name}${l.id>progress.unlocked?' (kilitli)':''}" ${i===levelIndex?'aria-current="step"':''}>${progress.best[l.id]&&i!==levelIndex?'✓':String(l.id).padStart(2,'0')}</button>`).join('');
    $('level-steps').querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.level))));
  }
  function start(index){
    if(index<0||index>=levels.length||index>=progress.unlocked)return;
    levelIndex=index;world=new World(levels[index]);if(renderer)renderer.setWorld(world);else renderer=new TempleArt.Renderer($('game'),world);
    paused=false;modalType=null;keys.clear();accumulator=0;$('overlay').hidden=true;$('pause-button').setAttribute('aria-label','Duraklat');
    $('level-name').innerHTML=`${world.level.name}<span class="title-dot">.</span>`;
    $('level-description').textContent=world.level.subtitle;$('stage-level').textContent=String(index+1).padStart(2,'0');document.querySelector('.stage-label').textContent='/ '+world.level.name.toLocaleUpperCase('tr');
    updateSteps();updateHUD();$('game').focus({preventScroll:true});
  }
  function updateHUD(){ $('gem-count').textContent=world.collected;$('timer').textContent=fmt(world.time); }
  function closeModal(){
    if(world.status!=='playing')return;
    paused=false;modalType=null;$('overlay').hidden=true;keys.clear();accumulator=0;$('pause-button').setAttribute('aria-label','Duraklat');$('game').focus({preventScroll:true});
  }
  function showModal(type,html,wide=false){
    paused=true;modalType=type;keys.clear();$('overlay').hidden=false;$('modal').classList.toggle('wide',wide);$('modal').innerHTML=html;
    $('pause-button').setAttribute('aria-label','Devam et');
    $('modal').querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{
      const action=b.dataset.action;
      if(action==='resume')closeModal();if(action==='restart')start(levelIndex);if(action==='levels')showLevels();if(action==='next')start(levelIndex+1);if(action==='first')start(0);
    }));
    $('modal').querySelector('button:not(:disabled)')?.focus({preventScroll:true});
  }
  function pause(){
    if(world.status!=='playing')return;
    if(paused){closeModal();return;}
    showModal('pause',`<div class="modal-eyebrow">KISA BİR MOLA</div><h2 id="modal-title">Tapınak bekliyor.</h2><p>İki ruh da hazır olduğunda yolculuğa devam edin.</p><button class="primary-button" data-action="resume">Maceraya devam et <span>→</span></button><button class="secondary-button" data-action="restart">Bölümü yeniden başlat</button><button class="secondary-button" data-action="levels">Bölümleri keşfet</button>`);
  }
  function showLevels(){
    showModal('levels',`<div class="modal-eyebrow">ORMANIN KADİM TAPINAĞI</div><h2 id="modal-title">Altı kapı. Bir yolculuk.</h2><p>Her kapı, birlikte çözeceğiniz yeni bir sır.</p><div class="level-grid">${levels.map((l,i)=>`<button class="level-card ${i===levelIndex?'current':''}" data-select="${i}" ${i>=progress.unlocked?'disabled':''}><b>${String(l.id).padStart(2,'0')} ${i>=progress.unlocked?'⌑':''}</b><strong>${l.name}</strong><small>${progress.best[l.id]?'★'.repeat(progress.best[l.id].stars):i>=progress.unlocked?'KİLİTLİ':'KEŞFET'}</small></button>`).join('')}</div><button class="secondary-button" data-action="${world.status==='playing'?'resume':'restart'}">${world.status==='playing'?'Oyuna dön':'Tekrar dene'}</button>`,true);
    $('modal').querySelectorAll('[data-select]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.select))));
  }
  function help(){
    showModal('help',`<div class="modal-eyebrow">TAPINAĞIN KURALLARI</div><h2 id="modal-title">İki ruh, aynı takım.</h2><div class="help-list"><div><strong class="fire">Kor · Ok tuşları</strong><p>← → hareket · ↑ zıpla · ↓ kolu çevir.<br>Ateş havuzundan geçebilir. Suya giremez.</p></div><div><strong class="water">Damla · WASD</strong><p>A D hareket · W zıpla · S kolu çevir.<br>Su havuzundan geçebilir. Ateşe giremez.</p></div><div>◇ Elmaslar ve çıkışlar<p>Her ruh kendi rengindeki elması toplar ve kendi kapısına girer. İki ruh aynı anda kapıdayken bölüm biter. Elmaslar yıldız kazandırır.</p></div><div>☷ Birlikte çözün<p>Sandıkları yürüyerek itin. Düğmeler üstünde biri veya sandık dururken geçit açılır. Kollar aşağı / S ile kalıcı olarak çevrilir.</p></div><div style="color:#bdd281">✧ Yeşile dikkat<p>Zehir ikiniz için de tehlikeli! Biriniz düşerse bölümü birlikte yeniden denersiniz.</p></div><div>★ Üç yıldızın sırrı<p>Bir yıldız çıkışa, bir yıldız tüm elmaslara, bir yıldız ${world.level.par} saniye içinde bitirmeye. Hareketli taşlara üstten binin.</p></div></div><p class="help-note">Fiziksel klavye gerekir. Android Brave'de yatay ekran ve tam ekran önerilir. R: yeniden başlat · Esc / P: duraklat · F: tam ekran · M: ses</p><button class="primary-button" data-action="${world.status==='playing'?'resume':'restart'}">${world.status==='playing'?'Hazırız, başlayalım →':'Tekrar deneyelim →'}</button>`,true);
  }
  function finish(){
    if(world.status==='dead'){
      const event=world.events.find(e=>e.type==='death'),reason=event?.hazard==='poison'?'Yeşil havuz iki ruh için de tehlikeli.':event?.player==='fire'?'Kor suya giremez. Birlikte yeniden deneyin.':'Damla ateşe giremez. Birlikte yeniden deneyin.';
      tone(115,.35,'triangle');showModal('dead',`<div class="modal-eyebrow">YOLCULUK BİTMEDİ</div><h2 id="modal-title">Birlikte yeniden.</h2><p>${reason}</p><button class="primary-button" data-action="restart">Tekrar dene <span>↻</span></button><button class="secondary-button" data-action="levels">Bölümler</button>`);return;
    }
    const id=world.level.id,old=progress.best[id];progress.best[id]={stars:Math.max(world.stars,old?.stars||0),time:Math.min(world.time,old?.time??Infinity)};progress.unlocked=Math.max(progress.unlocked,Math.min(6,id+1));save();updateSteps();tone(660,.3,'sine');
    const last=levelIndex===levels.length-1;
    showModal('won',`<div class="modal-eyebrow">${last?'TAPINAĞIN İKİ KORUYUCUSU':'BÖLÜM TAMAMLANDI'}</div><h2 id="modal-title">${last?'İki ışık, bir zafer.':'Birlikte başardınız.'}</h2><div class="modal-stars" aria-label="${world.stars} yıldız">${'★'.repeat(world.stars)}<span class="empty">${'★'.repeat(3-world.stars)}</span></div><p>${last?'Altı kapıyı da açtınız. Orman, ışığınıza kavuştu.':'Bir kapı daha açıldı. Tapınağın sırları sizi bekliyor.'}</p><div class="result-stats"><div>${fmt(world.time)}<span>SÜRE</span></div><div>${world.collected} / ${world.gems.length}<span>ELMAS</span></div><div>${fmt(progress.best[id].time)}<span>EN İYİ SÜRE</span></div></div><button class="primary-button" data-action="${last?'levels':'next'}">${last?'Yolculuğa göz at':'Sıradaki kapıya geç →'}</button><button class="secondary-button" data-action="restart">Bu bölümü yeniden keşfet</button>`);
  }
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else{await $('stage').requestFullscreen();try{await screen.orientation.lock('landscape');}catch{}}}catch{toast('Tam ekran açılamadı. Tarayıcının tam ekran seçeneğini kullanabilirsiniz.');}}
  const controlCodes=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyA','KeyD','KeyW','KeyS','Space']);
  addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(controlCodes.has(e.code)){e.preventDefault();if(!paused&&world.status==='playing')keys.add(e.code);}
    if(e.repeat)return;
    if(e.code==='Escape'||e.code==='KeyP'){e.preventDefault();pause();}
    if(e.code==='KeyR'){e.preventDefault();start(levelIndex);}
    if(e.code==='KeyM')toggleSound();if(e.code==='KeyF')fullscreen();
    if(paused&&e.code==='Tab'){
      const list=[...$('modal').querySelectorAll('button:not(:disabled)')];if(!list.length)return;
      const first=list[0],last=list[list.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  addEventListener('keyup',e=>{if(controlCodes.has(e.code))e.preventDefault();keys.delete(e.code);});
  addEventListener('blur',()=>{keys.clear();if(!paused&&world.status==='playing')pause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();if(!paused&&world.status==='playing')pause();}});
  $('restart-button').addEventListener('click',()=>start(levelIndex));$('pause-button').addEventListener('click',pause);$('sound-button').addEventListener('click',toggleSound);$('fullscreen-button').addEventListener('click',fullscreen);$('levels-button').addEventListener('click',showLevels);$('help-button').addEventListener('click',help);$('brand').addEventListener('click',e=>{e.preventDefault();showLevels();});
  $('game').addEventListener('pointerdown',()=>{if(!paused)$('game').focus({preventScroll:true});});
  document.addEventListener('fullscreenchange',()=>{keys.clear();$('fullscreen-button').setAttribute('aria-label',document.fullscreenElement?'Tam ekrandan çık':'Tam ekran');});
  function frame(now){
    const elapsed=Math.min(.1,(now-lastTime)/1000||0);lastTime=now;
    if(!paused&&world.status==='playing'){
      accumulator+=elapsed;
      while(accumulator>=DT&&world.status==='playing'){
        world.step([{left:keys.has('ArrowLeft'),right:keys.has('ArrowRight'),jump:keys.has('ArrowUp'),down:keys.has('ArrowDown')},{left:keys.has('KeyA'),right:keys.has('KeyD'),jump:keys.has('KeyW'),down:keys.has('KeyS')}]);accumulator-=DT;
        for(const e of world.events){renderer.event(e);if(e.type==='gem')tone(e.player==='fire'?660:880,.16);if(e.type==='jump')tone(220,.08,'triangle',.015);if(e.type==='switch')tone(160,.1,'triangle');}
      }
      updateHUD();if(world.status!=='playing')finish();
    }else accumulator=0;
    renderer.draw(paused?0:elapsed);requestAnimationFrame(frame);
  }
  updateSound();start(0);requestAnimationFrame(frame);
})();
