import { Behaviour } from './behaviour.js';

class LimitedLife extends Behaviour {
    constructor(lifetime, {onTick, onDeath} = {}) {
      super();
      this.lifetime = lifetime;
      this.remainingLife = this.lifetime;
      this.onTick = onTick ?? (() => {});
      this.onDeath = onDeath ?? (() => {});
    }

    update(particle, grid) {
      if (this.remainingLife <= 0) {
        this.onDeath(this, particle, grid);
      } else {
        this.remainingLife = Math.floor(this.remainingLife - 1);
      }

      this.onTick(this, particle);
    }
}

export { LimitedLife }
