'use strict';
// This controller uses ordinary player inputs. It never assigns player positions,
// changes geometry, opens gates, or marks gems as collected.
function controller(world) {
  const states=[0,0],jumpEnd=[0,0],lastJump=[-100,-100];
  const go=(p,x,jump=false)=>({left:p.x>x+2,right:p.x<x-2,jump});
  return frame=>world.players.map((p,i)=>{
    const s=states[i],level=world.level,hop=!(p.grounded&&p.jumpHeld);
    let input={};
    if(s===0){
      input=go(p,1010);
      const pool=level.pools.find(h=>p.x+p.w<h.x+3&&h.x-(p.x+p.w)<30);
      if(pool&&p.grounded&&frame-lastJump[i]>40){jumpEnd[i]=frame+62;lastJump[i]=frame;}
      input.jump=frame<jumpEnd[i];if(p.x>1005)states[i]=1;
    }
    if(s===1){input=go(p,1110,hop);if(p.grounded&&p.y+p.h<510)states[i]=2;}
    if(s===2){input=go(p,1030,hop);if(p.grounded&&p.y+p.h<425)states[i]=3;}
    if(s===3){
      if(world.crates.length){states[i]=4;return {};}
      input=go(p,970);if(Math.abs(p.x-970)<5){input.down=i===0;states[i]=4;}
    }
    if(s===4){
      input=go(p,230);if(p.x<238)states[i]=5;
      if(world.crates.length&&p.x>world.crates[0].x&&world.crates[0].x<930){
        input=go(p,p.x);input.jump=hop;if(p.y+p.h<375)input.left=true;
      }
    }
    if(s===5){input=go(p,139,hop);if(p.grounded&&p.y+p.h<345)states[i]=6;}
    if(s===6){input=go(p,275,hop);if(p.grounded&&p.y+p.h<240)states[i]=7;}
    if(s===7){input=go(p,595);if(Math.abs(p.x-595)<5){input.down=i===0;states[i]=8;}}
    if(s===8){input=go(p,level.doors[i].x+12);if(p.door)states[i]=9;}
    return input;
  });
}
if(typeof module!=='undefined')module.exports={controller};
