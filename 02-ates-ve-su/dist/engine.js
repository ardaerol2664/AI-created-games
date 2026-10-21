/* Deterministic fixed-step co-op platform simulation; no browser dependencies. */
(function (root) {
  'use strict';
  const DT = 1 / 120, SPEED = 238, GRAVITY = 1570, JUMP = 585;
  const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  const copy = value => JSON.parse(JSON.stringify(value));
  class World {
    constructor(level) {
      this.level = copy(level); this.time = 0; this.status = 'playing'; this.events = [];
      this.players = level.spawn.map(p => ({ ...p, w: 25, h: 40, vx: 0, vy: 0, grounded: false, coyote: 0, buffer: 0, jumpHeld: false, downHeld: false, face: 1, door: false }));
      this.gems = copy(level.gems).map(g => ({ ...g, taken: false }));
      this.crates = copy(level.crates).map(c => ({ ...c, vy: 0 }));
      this.levers = copy(level.levers); this.plates = copy(level.plates).map(p => ({ ...p, active: false }));
      this.gates = copy(level.gates).map(g => ({ ...g, open: false, amount: 0 }));
      this.lifts = copy(level.lifts).map(l => ({ ...l, previousY: l.y, dy: 0 }));
    }
    solids(excludeCrate) {
      return [...this.level.platforms, ...this.gates.filter(g => !g.open), ...this.lifts, ...this.crates.filter(c => c !== excludeCrate)];
    }
    axis(entity, amount, axis, solids) {
      entity[axis] += amount;
      let hit = false;
      for (const s of solids) {
        if (!overlaps(entity, s)) continue;
        hit = true;
        if (axis === 'x') entity.x = amount > 0 ? s.x - entity.w : s.x + s.w;
        else {
          entity.y = amount > 0 ? s.y - entity.h : s.y + s.h;
          if (amount > 0) entity.grounded = true;
          entity.vy = 0;
        }
      }
      return hit;
    }
    step(inputs = [{}, {}], dt = DT) {
      this.events = [];
      if (this.status !== 'playing') return;
      this.time += dt;
      for (const lift of this.lifts) {
        lift.previousY = lift.y;
        // Starts at the upper endpoint; a full cycle takes about six seconds.
        lift.y = lift.from + (lift.to - lift.from) * (0.5 - 0.5 * Math.cos(this.time * lift.speed * 2));
        lift.dy = lift.y - lift.previousY;
        for (const e of [...this.players, ...this.crates]) {
          if (Math.abs(e.y + e.h - lift.previousY) < 2 && e.x + e.w > lift.x && e.x < lift.x + lift.w && e.vy >= 0) {
            this.axis(e, lift.dy, 'y', this.solids(e).filter(s => s !== lift));
            e.grounded = true;
          }
        }
      }
      for (const c of this.crates) {
        c.grounded = false; c.vy += GRAVITY * dt;
        this.axis(c, c.vy * dt, 'y', this.solids(c));
      }
      this.players.forEach((p, index) => {
        const input = inputs[index] || {};
        if (input.jump && !p.jumpHeld) p.buffer = 0.11;
        p.jumpHeld = !!input.jump; p.buffer -= dt;
        p.coyote = p.grounded ? 0.09 : p.coyote - dt;
        if (p.buffer > 0 && p.coyote > 0) {
          p.vy = -JUMP; p.grounded = false; p.buffer = 0; p.coyote = 0;
          this.events.push({ type: 'jump', player: p.type, x: p.x, y: p.y + p.h });
        }
        if (!input.jump && p.vy < -230) p.vy += GRAVITY * dt * 1.5;
        p.vx = ((input.right ? 1 : 0) - (input.left ? 1 : 0)) * SPEED;
        if (p.vx) p.face = Math.sign(p.vx);
        const move = p.vx * dt;
        const probe = { ...p, x: p.x + move };
        for (const c of this.crates) {
          if (move && overlaps(probe, c)) {
            // A blocking actor cannot be crushed by a pushed crate.
            const blockers = [...this.solids(c), ...this.players.filter(other => other !== p)];
            this.axis(c, move * 0.78, 'x', blockers);
          }
        }
        this.axis(p, move, 'x', this.solids());
        p.x = Math.max(24, Math.min(1176 - p.w, p.x));
        p.grounded = false; p.vy = Math.min(780, p.vy + GRAVITY * dt);
        this.axis(p, p.vy * dt, 'y', this.solids());
        for (const pool of this.level.pools) {
          // Contact must be below the liquid surface; jumping over it is safe.
          if (overlaps(p, { x: pool.x + 2, y: pool.y + 5, w: pool.w - 4, h: pool.h }) && pool.type !== p.type) {
            this.status = 'dead'; this.events.push({ type: 'death', player: p.type, hazard: pool.type });
          }
        }
        if (p.y > 700) { this.status = 'dead'; this.events.push({ type: 'death', player: p.type, hazard: 'fall' }); }
        for (const gem of this.gems) {
          if (!gem.taken && gem.type === p.type && overlaps(p, { x: gem.x - 10, y: gem.y - 13, w: 20, h: 26 })) {
            gem.taken = true; this.events.push({ type: 'gem', player: p.type, x: gem.x, y: gem.y });
          }
        }
        if (input.down && !p.downHeld) {
          for (const l of this.levers) {
            if (Math.abs(p.x + p.w / 2 - l.x) < 46 && Math.abs(p.y + p.h - l.y) < 20) {
              l.on = !l.on; this.events.push({ type: 'switch' });
            }
          }
        }
        p.downHeld = !!input.down;
        p.door = this.level.doors.some(d => d.type === p.type && p.grounded && p.x >= d.x + 3 && p.x + p.w <= d.x + d.w - 3 && overlaps(p, d));
      });
      for (const plate of this.plates) {
        plate.active = [...this.players, ...this.crates].some(e => e.x + e.w > plate.x + 3 && e.x < plate.x + plate.w - 3 && Math.abs(e.y + e.h - (plate.y + plate.h)) < 4);
      }
      for (const gate of this.gates) {
        const active = this.levers.some(l => l.id === gate.control && l.on) || this.plates.some(p => p.id === gate.control && p.active);
        // An occupied gate stays open instead of trapping or crushing a player.
        gate.open = active || (gate.open && [...this.players, ...this.crates].some(e => overlaps(e, gate)));
        gate.amount += ((gate.open ? 1 : 0) - gate.amount) * Math.min(1, dt * 10);
      }
      if (this.status === 'playing' && this.players.every(p => p.door)) {
        this.status = 'won'; this.events.push({ type: 'win' });
      }
    }
    get collected() { return this.gems.filter(g => g.taken).length; }
    get stars() { return 1 + (this.collected === this.gems.length ? 1 : 0) + (this.time <= this.level.par ? 1 : 0); }
  }
  const api = { World, DT, SPEED, GRAVITY, JUMP, overlaps };
  root.TempleEngine = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(globalThis);
