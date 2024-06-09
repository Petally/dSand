import { Behaviour } from './behaviour.js';

class ClonerBehaviour extends Behaviour {
    constructor({acidPersistence} = {}) {
      super();
      this.acidPersistence = acidPersistence ?? 1
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    clone(particle, grid, clonePosition, index) {
        if (!grid.getIndex(index) || !grid.getIndex(clonePosition)) { return; }
        if (grid.isEmpty(index) || grid.getIndex(index).constructor.elementType == 'Solid') { return; }
        if (grid.getIndex(clonePosition).constructor.elementType == 'Solid') { return; }
        if (!grid.noWrap(particle.index, clonePosition)) { return; }

        grid.setIndex(clonePosition, grid.getIndex(index).constructor)
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        const vertical = particle.index - grid.width;
        const otherVertical = particle.index + grid.width;
        const side = particle.index + 1;
        const otherSide = particle.index - 1;

        this.clone(particle, grid, otherVertical, vertical);
        this.clone(particle, grid, side, vertical);
        this.clone(particle, grid, otherSide, vertical);
    }
}

export { ClonerBehaviour }
