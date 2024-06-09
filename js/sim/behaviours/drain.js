import { Behaviour } from './behaviour.js';

class DrainBehaviour extends Behaviour {
    constructor({acidPersistence} = {}) {
      super();
      this.acidPersistence = acidPersistence ?? 1
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    drain(particle, grid, index) {
        if (!grid.getIndex(index)) { return; }
        if (grid.isEmpty(index)) { return; }
        if (!grid.noWrap(particle.index, index)) { return; }

        const particleToDrain = grid.getIndex(index);
        if (particleToDrain && !particleToDrain.getBehaviour('DrainBehaviour')) {
            grid.clearIndex(particleToDrain.index);
        }
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        const vertical = particle.index + grid.width;
        const otherVertical = particle.index - grid.width;
        const side = particle.index + 1;
        const otherSide = particle.index - 1;

        this.drain(particle, grid, vertical);
        this.drain(particle, grid, otherVertical);
        this.drain(particle, grid, side);
        this.drain(particle, grid, otherSide);
    }
}

export { DrainBehaviour }
