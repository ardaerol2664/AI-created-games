'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const base=process.env.GAME_TEST_URL||'http://127.0.0.1:8082';
const output=process.env.GAME_TEST_OUTPUT||'/workspace/scratch';fs.mkdirSync(output,{recursive:true});
let checks=0;
function ok(value,message){assert.ok(value,message);checks++;console.log('PASS',message);}
async function instrument(page){
 await page.addInitScript(()=>{
  let api;
  Object.defineProperty(globalThis,'TempleEngine',{configurable:true,get(){return api;},set(value){api=value;const Original=api.World;api.World=class extends Original{constructor(level){super(level);globalThis.__testWorld=this;}};}});
 });
}
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await instrument(page);await page.goto(base);await page.locator('#game').waitFor();await page.waitForTimeout(200);
  ok(await page.title()==='Kor & Damla — İki Element, Tek Yol','Game loads');
  const before=await page.evaluate(()=>__testWorld.players.map(p=>p.x));
  await page.keyboard.down('ArrowRight');await page.keyboard.down('a');await page.waitForTimeout(200);await page.keyboard.up('ArrowRight');await page.keyboard.up('a');
  const after=await page.evaluate(()=>__testWorld.players.map(p=>p.x));
  ok(after[0]>before[0]+20&&after[1]<before[1]-20,'Physical arrow and WASD input works simultaneously');
  await page.keyboard.down('ArrowUp');await page.keyboard.down('w');await page.waitForTimeout(120);
  ok(await page.evaluate(()=>__testWorld.players.every(p=>p.y<545)),'Both physical jump keys work');
  await page.keyboard.up('ArrowUp');await page.keyboard.up('w');await page.keyboard.press('r');
  await page.keyboard.press('Escape');ok(await page.locator('#modal-title').innerText()==='Tapınak bekliyor.','Escape pauses');
  const time=await page.evaluate(()=>__testWorld.time);await page.waitForTimeout(200);
  ok(await page.evaluate(()=>__testWorld.time)===time,'Simulation freezes while paused');
  await page.getByRole('button',{name:'Maceraya devam et'}).click();await page.waitForTimeout(100);
  ok(await page.evaluate(()=>__testWorld.time)>time,'Resume continues simulation');
  await page.locator('#help-button').click();ok(await page.locator('#modal-title').innerText()==='İki ruh, aynı takım.','Help explains controls and mechanics');
  await page.getByRole('button',{name:'Hazırız, başlayalım'}).click();
  await page.locator('#levels-button').click();ok(await page.locator('.level-card:disabled').count()===5,'Unreached chapters are locked');
  await page.getByRole('button',{name:'Oyuna dön'}).click();
  await page.keyboard.press('r');await page.keyboard.down('ArrowRight');
  await page.waitForFunction(()=>__testWorld.status==='dead');await page.keyboard.up('ArrowRight');
  ok(await page.locator('#modal-title').innerText()==='Birlikte yeniden.','An opposing element shows retry screen');
  await page.keyboard.press('r');ok(await page.locator('#overlay').isHidden(),'R restarts after death');
  await page.locator('#sound-button').click();ok(await page.locator('#sound-button').getAttribute('aria-pressed')==='true','Sound toggles with Web Audio');
  await page.locator('#fullscreen-button').click();ok(await page.evaluate(()=>!!document.fullscreenElement),'Fullscreen opens');
  await page.keyboard.press('f');ok(await page.evaluate(()=>!document.fullscreenElement),'F exits fullscreen');
  // Replays only engine inputs for most of the route; final approach uses a real
  // ArrowRight key event, letting the actual app handle win/save/unlock/UI.
  if(await page.locator('#overlay').isVisible())await page.getByRole('button',{name:'Maceraya devam et'}).click();
  const solver=fs.readFileSync(path.join(__dirname,'solver.cjs'),'utf8');await page.addScriptTag({content:solver});
  await page.evaluate(()=>{
   const w=__testWorld,next=controller(w);
   for(let frame=0;frame<8000;frame++){
    const input=next(frame);
    if(w.players[0].door&&w.players[1].x>1058)break;
    w.step(input);
    if(w.status!=='playing')throw Error('Replay reached an unexpected terminal state');
   }
  });
  await page.keyboard.down('d');await page.waitForFunction(()=>__testWorld.status==='won');await page.keyboard.up('d');
  ok(await page.locator('#modal-title').innerText()==='Birlikte başardınız.','Both exits trigger the actual win screen');
  ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('kor-damla-progress-v1')).unlocked)===2,'Completion saves and unlocks next chapter');
  await page.getByRole('button',{name:'Sıradaki kapıya geç'}).click();
  ok(await page.locator('#level-name').innerText()==='Güneşin Kolu.','Next chapter starts');
  await page.reload();await page.locator('#levels-button').click();ok(await page.locator('.level-card:disabled').count()===4,'Progress survives reload');
  await page.getByRole('button',{name:'Oyuna dön'}).click();
  await page.screenshot({path:path.join(output,'kor-desktop.png'),fullPage:true});
  ok(errors.length===0,'No desktop browser JavaScript errors');
  await page.close();
  for(const viewport of [{width:915,height:412},{width:393,height:851}]){
   const mobile=await browser.newContext({viewport,deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36'});
   const mp=await mobile.newPage(),mobileErrors=[];mp.on('pageerror',e=>mobileErrors.push(e.message));await instrument(mp);await mp.goto(base);await mp.waitForTimeout(150);
   ok(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No horizontal overflow at ${viewport.width}×${viewport.height}`);
   const x=await mp.evaluate(()=>__testWorld.players[1].x);await mp.keyboard.down('d');await mp.waitForTimeout(160);await mp.keyboard.up('d');
   ok(await mp.evaluate(()=>__testWorld.players[1].x)>x+15,`Physical keyboard works with Android viewport ${viewport.width}×${viewport.height}`);
   await mp.locator('#help-button').click();ok(await mp.locator('#modal').isVisible(),'Mobile help is scrollable and usable');
   await mp.getByRole('button',{name:'Hazırız, başlayalım'}).click();
   if(viewport.width>viewport.height){
    await mp.keyboard.press('f');ok(await mp.evaluate(()=>!!document.fullscreenElement),'Physical F opens fullscreen on Android emulation');
    const box=await mp.locator('#game').boundingBox();ok(box.width<=viewport.width+1&&box.height<=viewport.height+1,'Fullscreen canvas fits Android landscape');
    await mp.screenshot({path:path.join(output,'kor-fullscreen.png')});await mp.keyboard.press('f');
    if(await mp.locator('#overlay').isVisible())await mp.getByRole('button',{name:'Maceraya devam et'}).click();
   }
   await mp.screenshot({path:path.join(output,`kor-android-${viewport.width}.png`),fullPage:true});
   ok(!mobileErrors.length,'No Android-emulation JavaScript errors');await mobile.close();
  }
  const filePage=await browser.newPage(),fileErrors=[];filePage.on('pageerror',e=>fileErrors.push(e.message));
  await filePage.route('**/*',route=>route.request().url()===base+'/ates-ve-su-tek-dosya.html'?route.continue():route.abort());
  await filePage.goto(base+'/ates-ve-su-tek-dosya.html');await filePage.waitForTimeout(200);
  ok(await filePage.locator('#game').isVisible()&&!fileErrors.length,'Single HTML runs when all additional requests are blocked');
  const resources=await filePage.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name).filter(n=>/^https?:/.test(n)&&!n.endsWith('ates-ve-su-tek-dosya.html')));
  ok(resources.length===0,'Single HTML requires zero network resources');
  await filePage.close();
  const blocked=await browser.newPage();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));const blockedErrors=[];blocked.on('pageerror',e=>blockedErrors.push(e.message));await blocked.goto(base);await blocked.waitForTimeout(100);
  ok(!blockedErrors.length&&await blocked.locator('#game').isVisible(),'Game works when storage is blocked');await blocked.close();
  console.log(`${checks} browser checks passed. Android Brave hardware remains unverified.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
