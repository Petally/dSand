import { Behaviour } from './behaviour.js';
import { Moves } from './moves.js';
import { Color } from '../../util/color.js';

class LiquifierBehaviour extends Behaviour {
    constructor() {
      super();
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    liquify(particleToLiquify, grid) {
        if (!particleToLiquify.getBehaviour('Moves')) {
            particleToLiquify.addBehaviour(new Moves({
                maxSpeed: 2 * particleToLiquify.density,
                acceleration: 0.05 * particleToLiquify.density,
            }));
        }

        const moves = particleToLiquify.getBehaviour('Moves');
        if (!moves) { return; }
        moves.acceleration = Math.abs(moves.acceleration);
        particleToLiquify.elementType = 'Liquid';
        particleToLiquify.color = particleToLiquify.color.subtract(new Color(0, 0, 10));
    }

    tryLiquify(particle, grid, index) {
        if (!grid.getIndex(index)) { return; }
        if (grid.isEmpty(index)) { return; }
        if (!grid.noWrap(particle.index, index)) { return; }

        const particleToLiquify = grid.getIndex(index);
        if (particleToLiquify.getBehaviour('LiquifierBehaviour') || particleToLiquify.getBehaviour('SolidifierBehaviour')) { return; }
        if (particleToLiquify.elementType === 'Solid' && !particleToLiquify.acidResistance) { return; }
        if (particleToLiquify.elementType === 'Liquid') { return; }

        if (particleToLiquify.elementType === 'Solid') {
            if (!particleToLiquify.acidResistance) { return; }
            if (Math.random() < particleToLiquify.acidResistance) { return; }
            this.liquify(particleToLiquify, grid);
        } else {
            this.liquify(particleToLiquify, grid);
        }
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        const vertical = particle.index + grid.width;
        const otherVertical = particle.index - grid.width;
        const side = particle.index + 1;
        const otherSide = particle.index - 1;

        this.tryLiquify(particle, grid, vertical);
        this.tryLiquify(particle, grid, otherVertical);
        this.tryLiquify(particle, grid, side);
        this.tryLiquify(particle, grid, otherSide);
    }
}

export { LiquifierBehaviour }
