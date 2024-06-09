import { Behaviour } from './behaviour.js';
import { Smoke } from '../elements/elements.js';

class Acid extends Behaviour {
    constructor({acidPersistence} = {}) {
      super();
      this.acidPersistence = acidPersistence ?? 1
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    eat(particle, grid, index) {
        if (!grid.getIndex(index)) { return; }
        if (grid.isEmpty(index)) { return; }
        if (!grid.noWrap(particle.index, index)) { return; }

        const particleToEat = grid.getIndex(index)
        if (particleToEat.getBehaviour('Acid')) { return; }

        const acidResistance = particleToEat.acidResistance;
        if (Math.random() < acidResistance) { return; }

        // 1/5 chance to spawn smoke
        if (Math.random() < 0.2) {
            grid.setIndex(index, Smoke);
        } else {
            grid.clearIndex(index);
        }

        if (Math.random() > this.acidPersistence) { return; }
        grid.clearIndex(particle.index);
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        const vertical = particle.index + grid.width;
        const otherVertical = particle.index - grid.width;
        const side = particle.index + 1;
        const otherSide = particle.index - 1;

        this.eat(particle, grid, vertical);
        this.eat(particle, grid, otherVertical);
        this.eat(particle, grid, side);
        this.eat(particle, grid, otherSide);
    }
}

export { Acid }
