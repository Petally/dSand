import { Particle } from './particle.js';
import { Color } from '../../util/color.js';

import { Moves } from '../behaviours/moves.js';
import { Flammable } from '../behaviours/flammable.js';
import { MovesToSideRandomly } from '../behaviours/movesToSideRandomly.js';
import { LimitedLife } from '../behaviours/limitedLife.js';
import { Acid as AcidBehaviour } from '../behaviours/acid.js';
import { PlantBehaviour } from '../behaviours/plant.js';

class Empty extends Particle {
	static baseColor = new Color(0, 0, 0);
	constructor(index) {
		super(index, {
            color: Empty.baseColor, 
            empty: true
        });
	}
}

class Wall extends Particle {
	static baseColor = new Color(0, 0, 50);
	static elementType = "Solid";

	constructor(index) {
		super(index, {
            color: Wall.baseColor,
        });
	}
}

class Wood extends Particle {
	static baseColor = new Color(32, 100, 25);
	static elementType = "Solid";

	constructor(index) {
		super(index, {
            color: Wood.baseColor,
            acidResistance: 0.9,
            behaviours: [
                new Flammable({
                    fuel: 200 + 100 * Math.random(),
                    chanceToCatch: 0.01,
                    emitSmoke: true,
                })
            ]
        });
	}
}

class Fuse extends Particle {
	static baseColor = new Color(39, 37, 67);
	static elementType = "Solid";

	constructor(index) {
		super(index, {
            color: Fuse.baseColor,
            behaviours: [
                new Flammable({
                    fuel: 1 + 30 * Math.random(),
                    chanceToCatch: 0.15,
                    emitSmoke: true,
                    smokeChance: 0.05
                })
            ]
        });
	}
}


class NaturalGas extends Particle {
	static baseColor = new Color(104, 100, 18);
	static elementType = "Gas";

	constructor(index) {
		super(index, {
            color: NaturalGas.baseColor,
            behaviours: [
                new Flammable({
                    fuel: 1 + 50 * Math.random(),
                    chanceToCatch: 0.08
                }),
                new Moves({
                    maxSpeed: 0.6,
                    acceleration: -0.05
                }),
                new MovesToSideRandomly({
                    chanceToMove: 0.1,
                })
            ]
        });
	}
}

class Coal extends Particle {
	static baseColor = new Color(0, 0, 25);
	static elementType = "Powder";

	constructor(index) {
		super(index, {
            color: Coal.baseColor,
            acidResistance: 0.89,
            behaviours: [
                new Flammable({
                    fuel: 100 + 100 * Math.random(),
                    chanceToCatch: 0.02
                }),
                new Moves({
                    maxSpeed: 9,
                    acceleration: 0.1
                })
            ]
        });
	}
}

class Oil extends Particle {
	static baseColor = new Color(302, 100, 26);
	static elementType = "Liquid";

	constructor(index) {
		super(index, {
            color: Oil.baseColor,
            behaviours: [
                new Flammable({
                    fuel: 10 + 100 * Math.random(),
                    chanceToCatch: 0.08,
                    emitSmoke: true
                }),
                new Moves({
                    maxSpeed: 9,
                    acceleration: 0.1
                })
            ]
        });
	}
}

class Fire extends Particle {
	static baseColor = new Color(0, 100, 50);
	static elementType = "Solid";

	constructor(index) {
		super(index, {
            color: Fire.baseColor,
            behaviours: [
                new Flammable({
                    fuel: 1 + 100 * Math.random(),
                    chanceToCatch: 0.01,
                    emitSmoke: true,
                    burning: true,
                })
            ]
        });
	}
}

class Sand extends Particle {
	static baseColor = new Color(40, 100, 50);
	static elementType = "Powder";
    static cursorProbability = 0.5;

	constructor(index) {
		super(index, {
            color: Sand.baseColor,
            acidResistance: 0.93,
			behaviours: [
				new Moves({
					maxSpeed: 12,
					acceleration: 0.1,
				})
			]
        });
	}
}

class Snow extends Particle {
	static baseColor = new Color(0, 0, 100);
	static elementType = "Powder";
    static cursorProbability = 0.5;

	constructor(index) {
		super(index, {
            color: Snow.baseColor,
            acidResistance: 0.5,
			behaviours: [
				new Moves({
					maxSpeed: 0.3,
					acceleration: 0.05,
				}),
                new MovesToSideRandomly(0.4)
			]
        });
	}
}


class Water extends Particle {
	static baseColor = new Color(222, 92, 64);
	static elementType = "Liquid";
    static cursorProbability = 0.5;

	constructor(index) {
		super(index, {
            color: Water.baseColor,
            acidResistance: 0.7,
			behaviours: [
				new Moves({
					maxSpeed: 12,
					acceleration: 0.1,
				})
			]
        });
	}
}

class Acid extends Particle {
	static baseColor = new Color(128, 100, 54);
	static elementType = "Liquid";
    static cursorProbability = 0.5;

	constructor(index) {
		super(index, {
            color: Acid.baseColor,
			behaviours: [
				new Moves({
					maxSpeed: 12,
					acceleration: 0.2,
				}),
                new AcidBehaviour({
                    acidPersistence: 0.4,
                })
			]
        });
	}
}


class Smoke extends Particle {
	static baseColor = new Color(0, 0, 50);
	static elementType = "Gas";
    static cursorProbability = 0.25;

	constructor(index) {
		super(index, {
            color: new Color(Smoke.baseColor.h, Smoke.baseColor.s, Smoke.baseColor.l),
			behaviours: [
                new LimitedLife(500 + 100 * Math.random(), {
                    onTick: (behaviour, particle) => {
                        particle.color.l = Smoke.baseColor.l * behaviour.remainingLife / behaviour.lifetime;
                    },
                    onDeath: (_, particle, grid) => {
                        grid.clearIndex(particle.index);
                    }
                }),
				new Moves({
					maxSpeed: 0.6,
					acceleration: -0.05,
				}),
                new MovesToSideRandomly(0.5)
			]
        });
	}
}

class Plant extends Particle {
	static baseColor = new Color(138, 100, 39);
	static elementType = "Solid";

	constructor(index) {
		super(index, {
            color: Plant.baseColor,
            acidResistance: 0.86,
            behaviours: [
                new Flammable({
                    fuel: 100 + 30 * Math.random(),
                    chanceToCatch: 0.05,
                    emitSmoke: true,
                    smokeChance: 0.05
                }),
                new PlantBehaviour({
                    newlyGrown: true,
                    growChance: 0.4,
                    growSpeed: 0.1,
                })
            ]
        });
	}
}


export { Empty, Wall, Wood, Fuse, NaturalGas, Oil, Coal, Fire, Sand, Snow, Water, Acid, Smoke, Plant };