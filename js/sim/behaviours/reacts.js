import { Behaviour } from './behaviour.js';

class Reacts extends Behaviour {
    // you have to choose between either going with reactantParticle or reactantBehaviour and reactantBehaviourProperty
    // resultantParticle is the particle class
    constructor({reactantParticle, reactantBehaviour, reactantBehaviourProperty, reactantPropertyValue, resultantParticle, chance} = {}) {
      super();
      if (!reactantParticle && !reactantBehaviour && !reactantBehaviourProperty) {
        console.log('Invalid reactant parameters!');
      }

      if (!resultantParticle) {
        console.log('Invalid resultantParticle!');
      }

      this.reactantParticle = reactantParticle;
      this.reactantBehaviour = reactantBehaviour;
      this.reactantBehaviourProperty = reactantBehaviourProperty;
      this.reactantPropertyValue = reactantPropertyValue;
      this.resultantParticle = resultantParticle;
      this.chance = chance ?? 1;
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    react(particle, grid, index) {
        if (!(Math.random() < this.chance)) { return; }
        if (!grid.getIndex(index)) { return; }
        if (!grid.noWrap(particle.index, index)) { return; }

        const newParticle = grid.getIndex(index);
        const reactsWithBehaviour = (this.reactantBehaviour && newParticle.getBehaviour(this.reactantBehaviour) && newParticle.getBehaviour(this.reactantBehaviour)[this.reactantBehaviourProperty] == this.reactantPropertyValue);
        const reactsWithParticle = (this.reactantParticle && newParticle.constructor.name === this.reactantParticle)
        if (reactsWithBehaviour || reactsWithParticle) {
            grid.setIndex(particle.index, this.resultantParticle);
        }
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        const vertical = particle.index + grid.width;
        const otherVertical = particle.index - grid.width;
        const side = particle.index + 1;
        const otherSide = particle.index - 1;

        this.react(particle, grid, vertical);
        this.react(particle, grid, otherVertical);
        this.react(particle, grid, side);
        this.react(particle, grid, otherSide);
    }
}

export { Reacts }
