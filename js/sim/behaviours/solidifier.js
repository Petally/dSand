import { Behaviour } from './behaviour.js';
import { Moves } from './moves.js';
import { Color } from '../../util/color.js';

class SolidifierBehaviour extends Behaviour {
    constructor() {
      super();
      this.solidifed = false;
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    solidify(particleToSolidify, grid) {
        particleToSolidify.removeBehaviour('MovesToSideRandomly');
        const moves = particleToSolidify.getBehaviour('Moves');
        if (moves) {
            moves.acceleration = Math.abs(moves.acceleration);
        }

        particleToSolidify.elementType = 'Powder';
        particleToSolidify.color = particleToSolidify.color.subtract(new Color(0, 0, -10));
        this.solidified = true;
    }

    trySolidify(particle, grid, index) {
        if (!grid.getIndex(index)) { return; }
        if (grid.isEmpty(index)) { return; }
        if (!grid.noWrap(particle.index, index)) { return; }

        const particleToSolidify = grid.getIndex(index);
        if (particleToSolidify.getBehaviour('LiquifierBehaviour') || particleToSolidify.getBehaviour('SolidifierBehaviour')) { return; }
        if (particleToSolidify.elementType === 'Powder' || particleToSolidify.elementType === 'Solid') { return; }

        this.solidify(particleToSolidify)
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        const neighbors = grid.getMooreNeighborhood(particle.index);
        for (let i = 0; i < neighbors.length; i++) {
            this.trySolidify(particle, grid, neighbors[i]);
        }
        if (this.solidified) {
            grid.clearIndex(particle.index);
        }
    }
}

export { SolidifierBehaviour }
