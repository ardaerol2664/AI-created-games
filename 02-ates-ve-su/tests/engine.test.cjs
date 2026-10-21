'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {World,DT,overlaps}=require('../dist/engine.js'),levels=require('../dist/levels.js');
const {controller}=require('./solver.cjs');
const tick=(w,n,input=[{},{}])=>{for(let i=0;i<n;i++)w.step(input);};
const clean=()=>{const l=JSON.parse(JSON.stringify(levels[0]));l.pools=[];return l;};

for(const level of levels)test(`Level ${level.id}: complete, collect all 8 gems, earn 3 stars with real inputs`,()=>{
  const w=new World(level),input=controller(w),seen=new Set();
  for(let frame=0;frame<120*60&&w.status==='playing';frame++){
    w.step(input(frame));for(const e of w.events)seen.add(e.type);
    for(const p of w.players){
      assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
      for(const solid of w.solids())assert.ok(!overlaps(p,{...solid,x:solid.x+.05,y:solid.y+.05,w:solid.w-.1,h:solid.h-.1}),`Clipping in level ${level.id}`);
    }
  }
  assert.equal(w.status,'won');assert.equal(w.collected,8);assert.equal(w.stars,3);
  assert.ok(seen.has('win'));if(level.levers.length)assert.ok(seen.has('switch'));
  if(level.plates.length){assert.ok(w.plates[0].active);assert.ok(w.crates[0].x<984);}
  console.log(`  Level ${level.id}: ${w.time.toFixed(2)} s, ${w.collected}/8 gems, ${w.stars} stars`);
});

test('Both characters move simultaneously in opposite directions',()=>{
  const w=new World(clean());tick(w,20,[{right:true},{left:true}]);assert.ok(w.players[0].x>130);assert.ok(w.players[1].x<130);
});
test('Jump must be released before jumping again; holding does not fly',()=>{
  const w=new World(clean());tick(w,2);tick(w,180,[{jump:true},{}]);assert.equal(w.players[0].y,554);
  tick(w,1);tick(w,10,[{jump:true},{}]);assert.ok(w.players[0].y<530);
});
test('Releasing jump early makes a shorter jump',()=>{
  const a=new World(clean()),b=new World(clean());tick(a,2);tick(b,2);let minA=554,minB=554;
  for(let i=0;i<80;i++){a.step([{jump:true},{}]);b.step([{jump:i<5},{}]);minA=Math.min(minA,a.players[0].y);minB=Math.min(minB,b.players[0].y);}
  assert.ok(minA<minB-25);
});
for(const type of ['fire','water'])for(const hazard of ['fire','water','poison'])test(`${type} in ${hazard} pool has correct outcome`,()=>{
  const l=clean();l.pools=[{x:90,y:594,w:100,h:25,type:hazard}];l.platforms=l.platforms.filter(p=>p.y!==594);l.spawn[0].type=type;l.spawn[1].x=240;
  const w=new World(l);tick(w,60);assert.equal(w.status,hazard===type?'playing':'dead');
});
test('Wrong-colored diamonds are not collected',()=>{
  const l=clean();l.gems=[{x:112,y:570,type:'water'}];const w=new World(l);tick(w,2);assert.equal(w.collected,0);
});
test('One exit alone does not finish a level; both matching exits do',()=>{
  const w=new World(clean());Object.assign(w.players[0],{x:1010,y:198});tick(w,2);assert.equal(w.status,'playing');
  Object.assign(w.players[1],{x:1100,y:198});tick(w,2);assert.equal(w.status,'won');
});
test('A held lever key only toggles once; release allows the next toggle',()=>{
  const w=new World(levels[1]);Object.assign(w.players[0],{x:960,y:382});tick(w,20,[{down:true},{}]);assert.equal(w.levers[0].on,true);assert.equal(w.gates[0].open,true);
  tick(w,1);tick(w,1,[{down:true},{}]);assert.equal(w.levers[0].on,false);assert.equal(w.gates[0].open,false);
});
test('Pressure switch opens while occupied and closes after release',()=>{
  const w=new World(levels[2]);Object.assign(w.players[0],{x:912,y:382});tick(w,2);assert.ok(w.plates[0].active);assert.ok(w.gates[0].open);
  Object.assign(w.players[0],{x:850,y:382});tick(w,2);assert.equal(w.plates[0].active,false);assert.equal(w.gates[0].open,false);
});
test('A gate waits for an occupant to leave before closing',()=>{
  const w=new World(levels[1]);w.levers[0].on=true;tick(w,2);Object.assign(w.players[0],{x:748,y:382});w.levers[0].on=false;tick(w,1);assert.ok(w.gates[0].open);
  Object.assign(w.players[0],{x:700,y:382});tick(w,1);assert.equal(w.gates[0].open,false);
});
test('Closed gate cannot be jumped over from the middle platform',()=>{
  const w=new World(levels[1]);Object.assign(w.players[0],{x:790,y:382});tick(w,2);tick(w,140,[{left:true,jump:true},{}]);assert.ok(w.players[0].x>=772);assert.equal(w.gates[0].open,false);
});
test('Stepping a terminal world does not change its state or timer',()=>{
  const w=new World(clean());w.status='won';tick(w,500,[{right:true},{}]);assert.equal(w.time,0);assert.equal(w.players[0].x,100);
});
test('Independent worlds never share level, gate, gem or crate state',()=>{
  const a=new World(levels[2]),b=new World(levels[2]);a.crates[0].x=400;a.gems[0].taken=true;a.gates[0].open=true;
  assert.equal(b.crates[0].x,984);assert.equal(b.collected,0);assert.equal(b.gates[0].open,false);
});
