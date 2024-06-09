import { Behaviour } from './behaviour.js';
import { Moves } from './moves.js';
import { Color } from '../../util/color.js';

class SolidifierBehaviour extends Behaviour {
    constructor() {
      super();
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    solidify(particleToSolidify, grid) {
        particleToSolidify.removeBehaviour('Moves');
        particleToSolidify.removeBehaviour('MovesToSideRandomly');
        if (particleToSolidify === 'Powder') {
            particleToSolidify.elementType = 'Solid';
        } else {
            particleToSolidify.elementType = 'Powder';
        }
        particleToSolidify.color = particleToSolidify.color.subtract(new Color(0, 0, -10));
    }

    trySolidify(particle, grid, index) {
        if (!grid.getIndex(index)) { return; }
        if (grid.isEmpty(index)) { return; }
        if (!grid.noWrap(particle.index, index)) { return; }

        const particleToSolidify = grid.getIndex(index);
        if (particleToSolidify.getBehaviour('LiquifierBehaviour') || particleToSolidify.getBehaviour('SolidifierBehaviour')) { return; }
        if (particleToSolidify.elementType === 'Solid') { return; }

        this.solidify(particleToSolidify)
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        const neighbors = grid.getMooreNeighborhood(particle.index);
        for (let i = 0; i < neighbors.length; i++) {
            this.trySolidify(particle, grid, neighbors[i]);
        }
    }
}

export { SolidifierBehaviour }
