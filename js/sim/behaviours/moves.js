import { Behaviour } from './behaviour.js';

class Moves extends Behaviour {
    constructor({maxSpeed, acceleration, velocity} = {}) {
        super();
        this.maxSpeed = maxSpeed ?? 0;
        this.acceleration = acceleration ?? 0;
        this.velocity = velocity ?? 0;
    }

    updateVelocity() {
        let newVelocity = this.velocity + this.acceleration;

        if (Math.abs(newVelocity) > this.maxSpeed) {
            newVelocity = Math.sign(newVelocity) * this.maxSpeed;
        }

        this.velocity = newVelocity;
    }

    resetVelocity() {
        this.velocity = 0;
    }

    getUpdateCount() {
        const abs = Math.abs(this.velocity);
        const floored = Math.floor(abs);
        const mod = abs - floored;
        // Treat a remainder (e.g. 0.5) as a random chance to update
        const randomUpdate = Math.random() < mod ? 1 : 0;
        return floored + randomUpdate;
    }

    isFluid(particle) {
        return particle.constructor?.elementType === 'Liquid' || particle.constructor?.elementType === 'Gas';
    }

    shouldUpdate(params) {
        return params.direction === Math.sign(this.velocity); 
    }

    // Call update function a number of times depending on velocity
    update(particle, grid, params) {
        this.updateVelocity();
        if (!this.shouldUpdate(params)) { return; }
        
        // Core movement logic
        let index = particle.index;
        const updateCount = this.getUpdateCount();
        for (let i = 0; i < updateCount; i++) {
            const preferredDirection = Math.random() < 0.5 ? 1 : -1;
            const nextDelta = Math.sign(this.velocity) * grid.width;
            const nextVertical = index + nextDelta;
            const preferredVertical = nextVertical + preferredDirection;
            const otherVertical = nextVertical - preferredDirection;
            const preferredSide = index + preferredDirection;
            const otherSide = index - preferredDirection;

            if (grid.canPassThrough(index, nextVertical)) {
                grid.swap(index, nextVertical);
            } else if (grid.canPassThrough(index, preferredVertical) && grid.noWrap(index, preferredVertical)) {
                grid.swap(index, preferredVertical);
            } else if (grid.canPassThrough(index, otherVertical) && grid.noWrap(index, otherVertical)) {
                grid.swap(index, otherVertical);
            } else if (this.isFluid(particle) && grid.canPassThrough(index, preferredSide) && grid.noWrap(index, preferredSide)) {
                grid.swap(index, preferredSide);
            } else if (this.isFluid(particle) && grid.canPassThrough(index, otherSide) && grid.noWrap(index, otherSide)) {
                grid.swap(index, otherSide);
            }

            const newIndex = particle.index;

            if (newIndex !== index) {
                index = newIndex;
            } else {
                this.resetVelocity();
                break;
            }
        }
    }
}

export { Moves }