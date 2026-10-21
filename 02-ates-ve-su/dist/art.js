/* Every shape, texture and character is drawn specifically for this game. */
(function (root) {
  'use strict';
  const FIRE = '#fa9a5b', WATER = '#83d5cc', POISON = '#b3d46e';
  function rng(seed) { return () => { seed = (Math.imul(seed, 1664525) + 1013904223) | 0; return (seed >>> 0) / 4294967296; }; }
  function path(c, points, fill, stroke, width = 1) {
    c.beginPath(); points.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.lineWidth = width; c.strokeStyle = stroke; c.stroke(); }
  }
  function glow(c, x, y, r, color) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, color); g.addColorStop(1, 'transparent'); c.fillStyle = g; c.fillRect(x-r, y-r, r*2, r*2); }
  function line(c, points, color, width = 1) { c.beginPath(); points.forEach((p, i) => i ? c.lineTo(...p) : c.moveTo(...p)); c.strokeStyle = color; c.lineWidth = width; c.stroke(); }
  function fern(c, x, y, size, random) {
    c.save(); c.translate(x, y); c.strokeStyle = '#788851'; c.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const a = -2.8 + i * .63, length = size * (.6 + random() * .4), dx = Math.cos(a) * length, dy = Math.sin(a) * length;
      line(c, [[0,0],[dx,dy]], '#627b45', 1);
      for (let j = 2; j < 7; j++) { const t = j / 7, lx = dx * t, ly = dy * t;
        line(c, [[lx - 4, ly + 3],[lx, ly],[lx + 5, ly + 1]], j%2 ? '#5b7643' : '#829257', 1.4);
      }
    } c.restore();
  }
  function platform(c, p, random) {
    const {x,y,w,h} = p; if (w <= 0) return;
    const g = c.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#71805a');g.addColorStop(.17,'#566447');g.addColorStop(1,'#344a34');
    c.fillStyle = '#0c1a1466';c.fillRect(x+5,y+8,w,h+7);
    c.fillStyle=g;c.fillRect(x,y,w,h);c.fillStyle='#99a06a';c.fillRect(x,y,w,2);c.fillStyle='#182c2077';c.fillRect(x,y+h-3,w,3);
    for(let bx=x;bx<x+w;bx+=45+random()*23){line(c,[[bx,y+3],[bx-2,y+h*.4],[bx+3,y+h]],'#293c2b',1.4);line(c,[[bx+2,y+4],[bx+1,y+h*.4]],'#89906a55',1);}
    for(let i=0;i<w*.27;i++){const px=x+random()*w,py=y+5+random()*Math.max(1,h-8);c.fillStyle=random()>.5?'#9f9e6d28':'#172d282a';c.fillRect(px,py,random()*6+1,1);}
    for(let i=0;i<w/11;i++){const px=x+random()*w, height=2+random()*7;c.fillStyle=['#8b9a55','#667d42','#a2a861','#4f6b3c'][i%4];path(c,[[px-2,y+2],[px-1,y-height],[px+2,y-2],[px+4,y+3]],c.fillStyle);}
    for(let i=0;i<w/80;i++){const px=x+random()*w;line(c,[[px,y+h-1],[px-3,y+h+9],[px+3,y+h+15]],'#55723c',1);}
  }
  function background(level) {
    const canvas = document.createElement('canvas');canvas.width=1200;canvas.height=660;const c=canvas.getContext('2d');const r=rng(31+level.id*13);
    const g=c.createLinearGradient(0,0,0,660);g.addColorStop(0,'#283b2d');g.addColorStop(.5,'#203c2e');g.addColorStop(1,'#172d23');c.fillStyle=g;c.fillRect(0,0,1200,660);
    // Soft light shafts are part of the background cache.
    c.save(); c.globalCompositeOperation='screen';
    for(const [x,w] of [[180,190],[545,240],[980,150]]){const light=c.createLinearGradient(x,0,x+120,660);light.addColorStop(0,'#b8c97a14');light.addColorStop(1,'#e1db9a00');path(c,[[x,0],[x+w,0],[x+w+190,660],[x+35,660]],light);}
    c.restore();
    // Masonry and recessed arches.
    for(let row=0;row<10;row++)for(let col=-1;col<15;col++){const x=col*92+(row%2)*46,y=row*73;c.fillStyle=`rgba(114,137,89,${.018+r()*.025})`;c.fillRect(x+2,y+2,88,68);line(c,[[x,y+70],[x+92,y+70],[x+92,y]],'#081d172a',2);}
    for(const x of [57,452,847]){
      c.beginPath();c.moveTo(x,592);c.lineTo(x,205);c.bezierCurveTo(x,61,x+286,61,x+286,205);c.lineTo(x+286,592);c.strokeStyle='#7a8b5520';c.lineWidth=21;c.stroke();
      c.beginPath();c.moveTo(x+13,594);c.lineTo(x+13,211);c.bezierCurveTo(x+13,77,x+273,77,x+273,211);c.lineTo(x+273,594);c.strokeStyle='#0d241b4d';c.lineWidth=8;c.stroke();
      for(let i=0;i<5;i++){c.fillStyle='#73834c17';c.fillRect(x-13,263+i*64,27,10);c.fillRect(x+272,263+i*64,27,10);}
    }
    // A weathered circular carving behind the middle passage.
    c.save();c.translate(577,330);c.strokeStyle='#87986117';c.lineWidth=1.5;
    for(const radius of [98,106,137,145]){c.beginPath();c.arc(0,0,radius,0,Math.PI*2);c.stroke();}
    for(let i=0;i<24;i++){c.save();c.rotate(i*Math.PI/12);line(c,[[0,-115],[-4,-128],[4,-128],[0,-121]],'#9aab6e2c');c.restore();}
    path(c,[[0,-65],[42,12],[0,70],[-42,12]],null,'#91a06518',2);line(c,[[-61,0],[61,0]],'#91a06518',2);c.restore();
    // Recessed stone columns and a shaded canopy.
    for(const x of [17,1173]){c.fillStyle='#122a2166';c.fillRect(x,50,19,560);c.fillStyle='#8b95612b';c.fillRect(x+3,55,2,553);for(let y=94;y<590;y+=67){c.fillStyle='#10251a88';c.fillRect(x-4,y,27,5);}}
    path(c,[[0,0],[1200,0],[1200,62],[1130,47],[1070,63],[1020,31],[932,51],[877,24],[774,33],[708,14],[580,41],[515,20],[440,29],[350,14],[237,48],[160,26],[78,57],[0,48]],'#162b20');
    for(let i=0;i<37;i++){
      const x=r()*1200,length=18+r()*125;
      line(c,[[x,9],[x-9,33],[x+6,56],[x-4, length]],'#334f30',2+r()*2);
      for(let y=30;y<length;y+=15)path(c,[[x-3,y],[x-15,y-7],[x-9,y+7]],'#425e36');
    }
    for(const p of level.platforms)platform(c,p,r);
    // Ground roots, ferns and smaller plants decorate safe ledges.
    for(const [x,y,s] of [[38,594,24],[234,594,15],[1051,594,22],[1146,508,17],[290,422,18],[1022,422,16],[126,330,14],[274,238,18],[943,238,15]])fern(c,x,y,s,r);
    // Hanging gold ornaments near the start and final shrine.
    for(const [x,y] of [[64,492],[1142,122]]){line(c,[[x,y-28],[x,y+12]],'#a6a27166');path(c,[[x,y-8],[x+7,y],[x,y+9],[x-7,y]],null,'#d2bf7b88',1);c.fillStyle='#afaf7377';c.fillRect(x-2,y+13,4,4);}
    // Fine weathering and ambient speckles.
    for(let i=0;i<900;i++){const x=r()*1200,y=r()*660;c.fillStyle=i%3?'#b5bd8d06':'#071a1519';c.fillRect(x,y,1+r()*3,1+r()*2);}
    const vignette=c.createRadialGradient(600,300,160,600,330,730);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#05160e80');c.fillStyle=vignette;c.fillRect(0,0,1200,660);
    return canvas;
  }
  function door(c,d,active,time){
    const x=d.x,y=d.y,w=d.w,h=d.h,col=d.type==='fire'?FIRE:WATER;
    glow(c,x+w/2,y+h/2,84,active?(d.type==='fire'?'#f5a15436':'#72eadc35'):(d.type==='fire'?'#f5a15410':'#72eadc10'));
    c.fillStyle='#101f19';c.beginPath();c.roundRect(x-5,y-3,w+10,h+3,[28,28,0,0]);c.fill();
    c.beginPath();c.roundRect(x-7,y-4,w+14,h+4,[30,30,0,0]);c.lineWidth=6;c.strokeStyle='#63734e';c.stroke();
    c.beginPath();c.roundRect(x-7,y-4,w+14,h+4,[30,30,0,0]);c.lineWidth=1;c.strokeStyle='#a9ab6a77';c.stroke();
    const g=c.createLinearGradient(x,y,x+w,y);g.addColorStop(0,'#162e24');g.addColorStop(.5,active?'#95b49333':'#2e4530');g.addColorStop(1,'#142c24');c.fillStyle=g;c.beginPath();c.roundRect(x+3,y+5,w-6,h-5,[22,22,0,0]);c.fill();
    for(let i=1;i<4;i++)line(c,[[x+i*w/4,y+15],[x+i*w/4,y+h]],'#76906426');
    c.strokeStyle=col;c.globalAlpha=active?1:.65;c.lineWidth=1.5;
    if(d.type==='fire')path(c,[[x+w/2,y+21],[x+w/2+10,y+40],[x+w/2-10,y+40]],null,col,1.5);
    else path(c,[[x+w/2,y+20],[x+w/2+9,y+32],[x+w/2,y+43],[x+w/2-9,y+32]],null,col,1.5);
    line(c,[[x+w/2,y+49],[x+w/2,y+61]],col);c.globalAlpha=1;
    for(const side of [-1,1]){const px=x+w/2+side*(w/2+7);c.fillStyle='#74815b';c.fillRect(px-5,y+22,10,7);c.fillRect(px-5,y+57,10,7);c.fillStyle='#a3a674';c.fillRect(px-5,y+22,10,1);}
    c.fillStyle='#919862';c.fillRect(x-15,y+h-3,w+30,6);c.fillStyle='#b5b17b';c.fillRect(x-15,y+h-3,w+30,1);
    c.font='7px Arial';c.textAlign='center';c.fillStyle=col;c.globalAlpha=.7;c.fillText(d.type==='fire'?'KOR':'DAMLA',x+w/2,y-19);c.globalAlpha=1;
    if(active){for(let i=0;i<7;i++){const t=(time*.35+i*.14)%1;c.fillStyle=col;c.globalAlpha=(1-t)*.4;c.fillRect(x+8+(i*17)%(w-12),y+h-t*78,1,2);}c.globalAlpha=1;}
  }
  function gem(c,g,time){if(g.taken)return;const col=g.type==='fire'?FIRE:WATER;const y=g.y+Math.sin(time*2.2+g.x)*2;
    glow(c,g.x,y,24,g.type==='fire'?'#ffab6512':'#7ce7dd16');path(c,[[g.x,y-10],[g.x+8,y],[g.x,y+10],[g.x-8,y]],col);
    path(c,[[g.x,y-10],[g.x,y+2],[g.x-8,y]],g.type==='fire'?'#ffcb88':'#b5f5e8');path(c,[[g.x,y+2],[g.x+8,y],[g.x,y+10]],g.type==='fire'?'#c4623c':'#469b97');
    line(c,[[g.x-2,y-6],[g.x-5,y-1]],'#f6f6cdaa');}
  function player(c,p,time,dead){
    const fire=p.type==='fire',col=fire?FIRE:WATER,x=p.x+p.w/2,y=p.y,walk=p.grounded?Math.sin(time*17)*Math.min(1,Math.abs(p.vx)/120):0;
    c.save();c.translate(x,y);const bob=p.grounded&&p.vx?Math.abs(walk)*1.3:Math.sin(time*3)*.5;
    c.globalAlpha=dead?.7:1;glow(c,0,21,42,fire?'#ef8b3c13':'#80e8dd13');
    // Shadow sits just under grounded characters, separate from the body glow.
    if(p.grounded){c.fillStyle='#071a1377';c.beginPath();c.ellipse(0,40,14,3,0,0,Math.PI*2);c.fill();}
    c.strokeStyle=fire?'#d97442':'#5cafab';c.lineWidth=4;c.lineCap='round';
    line(c,[[-5,29],[-6+walk*3,36],[-9+walk*4,38]],c.strokeStyle,4);
    line(c,[[5,29],[6-walk*3,36],[9-walk*4,38]],c.strokeStyle,4);
    line(c,[[-8,22],[-14-walk*2,28+walk*2]],col,3);line(c,[[8,22],[14+walk*2,27-walk*2]],col,3);
    c.save();c.translate(0,-bob);
    const g=c.createLinearGradient(0,0,0,33);g.addColorStop(0,fire?'#ffd278':'#b0f2dd');g.addColorStop(.5,fire?'#fb9957':'#79cfc2');g.addColorStop(1,fire?'#dc663e':'#459f9e');
    c.fillStyle=g;c.beginPath();
    if(fire){c.moveTo(-9,28);c.bezierCurveTo(-15,19,-13,13,-6,7);c.bezierCurveTo(-7,15,-3,13,-2,7);c.lineTo(1,-3+Math.sin(time*7));c.bezierCurveTo(5,5,10,7,8,12);c.lineTo(12,7);c.bezierCurveTo(16,21,12,29,6,31);c.bezierCurveTo(1,33,-5,33,-9,28);}
    else{c.moveTo(0,-2);c.bezierCurveTo(-3,8,-15,14,-13,23);c.bezierCurveTo(-12,37,13,37,13,22);c.bezierCurveTo(14,14,3,7,0,-2);}
    c.fill();
    if(fire)path(c,[[-7,15],[-4,9],[-4,18],[-8,22]],'#ffd89577');else{c.beginPath();c.ellipse(-6,16,2.2,5,.5,0,6.28);c.fillStyle='#c9fff18c';c.fill();}
    // Expressive eyes follow the walking direction; natural periodic blink.
    const blink=Math.sin(time*1.7+(fire?0:2))>.996,ey=19;
    for(const ex of [-5,5]){c.fillStyle='#123c33';c.beginPath();c.ellipse(ex+p.face,ey,1.7,blink?.5:3,0,0,6.28);c.fill();if(!blink){c.fillStyle='#fff9cd';c.fillRect(ex+p.face-.5,ey-1.5,1,1);}}
    c.beginPath();c.arc(p.face,23,2.6,.2,Math.PI-.2);c.strokeStyle=fire?'#8e502e':'#347c73';c.lineWidth=1;c.stroke();
    c.restore();c.restore();
  }
  function torch(c,x,y,time){
    glow(c,x,y,85,'#edb56212');glow(c,x,y,31,'#efb26015');c.fillStyle='#766f47';c.fillRect(x-2,y+4,4,25);path(c,[[x-9,y+5],[x+9,y+5],[x+5,y+13],[x-5,y+13]],'#a39a61');
    const sway=Math.sin(time*9+x)*2;path(c,[[x-5,y+4],[x-7,y-4],[x+sway,y-18],[x+5,y-5],[x+5,y+4]],'#ecad62');path(c,[[x-2,y+5],[x-2,y-6],[x+2+sway,y-11],[x+3,y+4]],'#ffe5a0');
  }
  class Renderer{
    constructor(canvas,world){this.canvas=canvas;this.c=canvas.getContext('2d',{alpha:false});this.setWorld(world);this.particles=[];this.reduced=typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches;}
    setWorld(world){this.world=world;this.back=background(world.level);this.particles=[];}
    event(e){if(this.reduced)return;if(e.type==='gem'||e.type==='jump')for(let i=0;i<(e.type==='gem'?10:4);i++)this.particles.push({x:e.x,y:e.y,vx:(Math.random()-.5)*75,vy:-Math.random()*80,life:1,max:1,color:e.player==='fire'?FIRE:WATER});}
    draw(dt){
      const w=this.world,c=this.c,t=this.reduced?0:w.time;
      const dpr=Math.min(2,root.devicePixelRatio||1),width=Math.round(this.canvas.clientWidth*dpr),height=Math.round(this.canvas.clientHeight*dpr);
      if(width&&height&&(this.canvas.width!==width||this.canvas.height!==height)){this.canvas.width=width;this.canvas.height=height;}
      c.setTransform(this.canvas.width/1200,0,0,this.canvas.height/660,0,0);c.drawImage(this.back,0,0);
      for(const pool of w.level.pools){const col=pool.type==='fire'?FIRE:pool.type==='water'?WATER:POISON;
        glow(c,pool.x+pool.w/2,pool.y+9,75,pool.type==='fire'?'#ee773f13':pool.type==='water'?'#3cbca916':'#8fb83c19');
        const g=c.createLinearGradient(0,pool.y,0,pool.y+pool.h);g.addColorStop(0,pool.type==='fire'?'#d36d3d':pool.type==='water'?'#438d82':'#6e853f');g.addColorStop(1,'#1d3c2a');c.fillStyle=g;c.fillRect(pool.x,pool.y+5,pool.w,pool.h-5);
        const points=[];for(let x=0;x<=pool.w;x+=5)points.push([pool.x+x,pool.y+4+Math.sin(x*.12+t*3)*1.3]);line(c,points,col,2);
        for(let i=0;i<8;i++){const bx=pool.x+9+(i*17)%Math.max(1,pool.w-18),by=pool.y+10+Math.sin(t*1.8+i)*3;c.fillStyle=col;c.globalAlpha=.15+Math.sin(t*2+i)*.1;c.fillRect(bx,by,5,1);}c.globalAlpha=1;
        c.fillStyle='#81905b';c.fillRect(pool.x-3,pool.y,4,10);c.fillRect(pool.x+pool.w-1,pool.y,4,10);
      }
      w.level.doors.forEach(d=>door(c,d,w.players.some(p=>p.type===d.type&&p.door),t));
      for(const l of w.levers){
        const x=l.x,y=l.y;c.fillStyle='#8d9364';c.fillRect(x-16,y-7,32,7);c.fillStyle='#515f42';c.fillRect(x-12,y-12,24,7);
        c.lineCap='round';line(c,[[x,y-9],[x+(l.on?13:-13),y-37]],'#b7a975',4);glow(c,x+(l.on?13:-13),y-37,17,l.on?'#e1d99417':'#9fae6f0b');c.fillStyle=l.on?'#e5ce86':'#9aab73';c.beginPath();c.arc(x+(l.on?13:-13),y-37,5,0,6.28);c.fill();
        c.textAlign='center';c.font='8px Arial';c.fillStyle='#bdc39b';c.fillText('↓ / S',x,y-53);
      }
      for(const p of w.plates){c.fillStyle='#344b30';c.fillRect(p.x-4,p.y+1,p.w+8,5);c.fillStyle=p.active?'#d5c98a':'#8e9560';c.fillRect(p.x,p.y+(p.active?3:0),p.w,3);if(p.active)glow(c,p.x+p.w/2,p.y,35,'#dacf8a15');}
      for(const gate of w.gates){c.save();c.beginPath();c.rect(gate.x-5,gate.y-7,gate.w+10,gate.h+8);c.clip();const gy=gate.y-gate.amount*(gate.h+8);
        c.fillStyle='#5d6948';c.fillRect(gate.x,gy,gate.w,gate.h);c.fillStyle='#8e9661';c.fillRect(gate.x,gy,2,gate.h);
        for(let y=gy+7;y<gy+gate.h;y+=19){path(c,[[gate.x+4,y],[gate.x+gate.w-4,y+3],[gate.x+gate.w-4,y+11],[gate.x+4,y+9]],'#3e5235');line(c,[[gate.x+5,y],[gate.x+gate.w-4,y+3]],'#9ea16a66');}
        c.restore();c.fillStyle='#a29b62';c.fillRect(gate.x-6,gate.y-6,gate.w+12,6);}
      for(const lift of w.lifts){line(c,[[lift.x+lift.w/2,lift.from-30],[lift.x+lift.w/2,lift.to+20]],'#83956a30',2);platform(c,lift,rng(13));path(c,[[lift.x+lift.w/2-5,lift.y+6],[lift.x+lift.w/2,lift.y+2],[lift.x+lift.w/2+5,lift.y+6]],null,'#d3c98a88');}
      for(const crate of w.crates){const{x,y,w:sw,h}=crate;c.fillStyle='#8b8050';c.fillRect(x,y,sw,h);c.fillStyle='#5b5f3b';c.fillRect(x+4,y+4,sw-8,h-8);line(c,[[x+5,y+5],[x+sw-5,y+h-5]],'#8e8755',5);line(c,[[x+sw-5,y+5],[x+5,y+h-5]],'#8e8755',5);c.strokeStyle='#b0a46c';c.lineWidth=1;c.strokeRect(x+.5,y+.5,sw-1,h-1);for(const dx of [3,sw-4])for(const dy of [3,h-4]){c.fillStyle='#c3b47d';c.fillRect(x+dx,y+dy,2,2);}}
      for(const g of w.gems)gem(c,g,t);
      torch(c,67,408,t);torch(c,1073,307,t);torch(c,291,166,t);
      for(const p of w.players)player(c,p,t,w.status==='dead');
      if(w.time<7){for(const p of w.players){c.textAlign='center';c.font='7px Arial';c.fillStyle=p.type==='fire'?FIRE:WATER;c.globalAlpha=Math.min(1,(7-w.time)/2)*.85;c.fillText(p.type==='fire'?'KOR · OKLAR':'DAMLA · WASD',p.x+p.w/2,p.y-12);c.globalAlpha=1;}}
      if(!this.reduced)for(let i=0;i<24;i++){const x=(i*79.7+t*(3+i%4))%1160+20,y=(i*137.3+Math.sin(t*.2+i)*19)%560+48;glow(c,x,y,3,'#d1d48b0c');c.fillStyle='#c4ca7d';c.globalAlpha=.1+Math.sin(t*1.2+i)*.09;c.fillRect(x,y,1,1);}c.globalAlpha=1;
      this.particles=this.particles.filter(p=>p.life>0);for(const p of this.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=110*dt;c.fillStyle=p.color;c.globalAlpha=Math.max(0,p.life/p.max);c.fillRect(p.x,p.y,2,2);}c.globalAlpha=1;
    }
  }
  root.TempleArt={Renderer};
})(globalThis);
