import { Smoke } from "../elements/elements.js";
import { LimitedLife } from "./limitedLife.js";
import { Color } from "../../util/color.js";

class Flammable extends LimitedLife {
    static colors = [
        new Color(0, 47, 22),
        new Color(36, 100, 51),
        new Color(23, 100, 46),
        new Color(25, 100, 50),
        new Color(51, 93, 48),
    ]

    constructor({fuel, chanceToCatch, emitSmoke, smokeChance, emitEmber, burning}) {
        super(fuel, {
            onTick: (behaviour, particle) => {
                const frequency = Math.sqrt(behaviour.lifetime / behaviour.remainingLife);
                const period = frequency * Flammable.colors.length;
                const pct = behaviour.remainingLife / period;
                const colorIndex = (Math.floor(pct) % Flammable.colors.length);
                particle.color = Flammable.colors[colorIndex];
            },
            onDeath: (_, particle, grid) => {
                if (particle.getBehaviour('Flammable').emitSmoke && Math.random() < this.smokeChance) {
                    grid.setIndex(particle.index, Smoke);
                } else {
                    grid.clearIndex(particle.index);
                }
            }
        })

        this.emitSmoke = emitSmoke ?? false;
        this.smokeChance = smokeChance ?? 0.3;
        this.emitEmber = emitEmber ?? false;
        this.chanceToCatch = chanceToCatch ?? 0.01;
        this.chancesToCatch = 0;
        this.burning = burning ?? false;
    }

    shouldUpdate(params) {
        return params.direction === 1;
    }

    tryToSpread(particle, grid) {
        const candidates = grid.getMooreNeighborhood(particle.index);
        for (let i = 0; i < candidates.length; i++) {
            const p = grid.getIndex(candidates[i]);
            const flammable = p.getBehaviour('Flammable');
            if (!flammable) { continue; }
            if (flammable.burning) { continue; }
            flammable.chancesToCatch += 0.5 + Math.random() * 0.5;
        }
    }

    update(particle, grid, params) {
        if (!this.shouldUpdate(params)) { return; }
        if (this.chancesToCatch > 0 && !this.burning) {
            // Check if we caught fire
            const chanceToCatch = this.chancesToCatch * this.chanceToCatch;
            if (Math.random() < chanceToCatch) {
                this.burning = true;
            }
            this.chancesToCatch = 0
        }
        if (this.burning) {
            super.update(particle, grid, params);
            this.tryToSpread(particle, grid);
        }
    }
}

export { Flammable }