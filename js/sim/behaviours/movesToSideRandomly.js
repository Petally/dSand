import { Behaviour } from './behaviour.js';

class MovesToSideRandomly extends Behaviour {
    constructor({chanceToMove} = {}) {
        super();
        this.chanceToMove = chanceToMove ?? 0.3;
    }

    shouldUpdate(params) {
        return params.direction === 1; 
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        if (!(Math.random() < this.chanceToMove)) { return; }
        const moves = particle.getBehaviour('Moves');
        if (moves && !(grid.canPassThrough(particle.index, particle.index + (grid.width * Math.sign(moves.velocity))))) { return; }
        // Core movement logic
        const index = particle.index;
        const preferredDirection = Math.random() < 0.5 ? 1 : -1;
        const nextIndex = particle.index + preferredDirection;
        if (!grid.canPassThrough(particle.index, nextIndex)) { return; }
        if (!grid.noWrap(index, nextIndex)) { return; }
        grid.swap(index, nextIndex);
    }
}

export { MovesToSideRandomly }