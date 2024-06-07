import { Behaviour } from './behaviour.js';

class PlantBehaviour extends Behaviour {
    constructor({newlyGrown, growChance} = {}) {
      super();
      this.newlyGrown = newlyGrown ?? Math.random() < 0.5;
      this.growChance = growChance ?? 0.1;
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    grow(particle, grid, index) {
        if (!(Math.random() < this.growChance)) { return; }
        if (!grid.grid[index]) { return; }
        if (!grid.noWrap(particle.index, index)) { return; }

        const newParticle = grid.grid[index]
        if (newParticle.constructor.name == 'Water' || (grid.isEmpty(index) && this.newlyGrown)) {
            grid.setIndex(index, particle.constructor);
        }
    }

    update(particle, grid, params) {
        if (!params) { return; }
        if (!this.shouldUpdate(params)) { return; }
        const vertical = particle.index + grid.width;
        const otherVertical = particle.index - grid.width;
        const side = particle.index + 1;
        const otherSide = particle.index - 1;

        this.grow(particle, grid, vertical);
        this.grow(particle, grid, otherVertical);
        this.grow(particle, grid, side);
        this.grow(particle, grid, otherSide);

        if (!this.newlyGrown) { return; }
        this.newlyGrown = false;
    }
}

export { PlantBehaviour }
