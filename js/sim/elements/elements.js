import { Particle } from './particle.js';
import { Color } from '../../util/color.js';

import { Moves } from '../behaviours/moves.js';
import { Flammable } from '../behaviours/flammable.js';
import { MovesToSideRandomly } from '../behaviours/movesToSideRandomly.js';
import { LimitedLife } from '../behaviours/limitedLife.js';
import { Acid as AcidBehaviour } from '../behaviours/acid.js';
import { PlantBehaviour } from '../behaviours/plant.js';
import { DrainBehaviour } from '../behaviours/drain.js';
import { ClonerBehaviour } from '../behaviours/cloner.js';
import { Reacts } from '../behaviours/reacts.js';
import { LiquifierBehaviour } from '../behaviours/liquifier.js';
import { SolidifierBehaviour } from '../behaviours/solidifier.js';

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
	static baseElementType = 'Solid';

	constructor(index) {
		super(index, {
            color: Wall.baseColor,
            elementType: Wall.baseElementType
        });
	}
}

class Wood extends Particle {
	static baseColor = new Color(32, 100, 25);
	static baseElementType = 'Solid';

	constructor(index) {
		super(index, {
            color: new Color(Wood.baseColor.h, Wood.baseColor.s, Wood.baseColor.l).subtract(new Color(Math.random() * 2, Math.random() * 4, Math.random() * 20)),
            elementType: Wood.baseElementType,
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
	static baseElementType = 'Solid';

	constructor(index) {
		super(index, {
            color: Fuse.baseColor,
            elementType: Fuse.baseElementType,
            behaviours: [
                new Flammable({
                    fuel: 10 + 30 * Math.random(),
                    chanceToCatch: 0.3,
                    emitSmoke: true,
                    smokeChance: 0.05
                })
            ]
        });
	}
}


class NaturalGas extends Particle {
	static baseColor = new Color(104, 100, 18);
	static baseElementType = 'Gas';

	constructor(index) {
		super(index, {
            color: NaturalGas.baseColor,
            elementType: NaturalGas.baseElementType,
            density: -0.3,
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
	static baseElementType = 'Powder';

	constructor(index) {
		super(index, {
            color: new Color(Coal.baseColor.h, Coal.baseColor.s, Coal.baseColor.l).subtract(new Color(Math.random() * 2, 0, Math.random() * 30)),
            elementType: Coal.baseElementType,
            density: 1.22,
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
	static baseElementType = "Liquid";

	constructor(index) {
		super(index, {
            color: Oil.baseColor,
            elementType: Oil.baseElementType,
            density: 2,
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
	static baseElementType = "Solid";

	constructor(index) {
		super(index, {
            color: Fire.baseColor,
            elementType: Fire.baseElementType,
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
	static baseElementType = "Powder";
    static cursorProbability = 0.5;

	constructor(index) {
		super(index, {
            color: new Color(Sand.baseColor.h, Sand.baseColor.s, Sand.baseColor.l).subtract(new Color(Math.random() * 2, Math.random() * 4, Math.random() * 10)),
            elementType: Sand.baseElementType,
            density: 1.2,
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
	static baseElementType = "Powder";
    static cursorProbability = 0.5;

	constructor(index) {
		super(index, {
            color: Snow.baseColor,
            elementType: Snow.baseElementType,
            density: 1.03,
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
	static baseElementType = "Liquid";
    static cursorProbability = 0.5;

	constructor(index) {
		super(index, {
            color: Water.baseColor,
            elementType: Water.baseElementType,
            density: 1,
            acidResistance: 0.7,
			behaviours: [
				new Moves({
					maxSpeed: 12,
					acceleration: 0.1,
				}),
                new Reacts({
                    reactantBehaviour: 'Flammable',
                    reactantBehaviourProperty: 'burning',
                    reactantPropertyValue: true,
                    resultantParticle: Steam,
                    chance: 0.01,
                })
			]
        });
	}
}

class Steam extends Particle {
	static baseColor = new Color(222, 60, 80);
	static baseElementType = "Gas";
    static cursorProbability = 0.25;

	constructor(index) {
		super(index, {
            color: new Color(Steam.baseColor.h, Steam.baseColor.s, Steam.baseColor.l),
            elementType: Steam.baseElementType,
            density: -0.4,
			behaviours: [
                new LimitedLife(500 + 300 * Math.random(), {
                    onTick: (behaviour, particle) => {
                        particle.color.l = Steam.baseColor.l / 2 + (Steam.baseColor.l * behaviour.remainingLife / behaviour.lifetime) / 2;
                    },
                    onDeath: (_, particle, grid) => {
                        if (Math.random() < 0.1) {
                            grid.setIndex(particle.index, Water);
                        } else {
                            grid.clearIndex(particle.index);
                        }
                    }
                }),
				new Moves({
					maxSpeed: 0.45,
					acceleration: -0.03,
				}),
                new MovesToSideRandomly(0.5)
			]
        });
	}
}

class Acid extends Particle {
	static baseColor = new Color(128, 100, 54);
	static baseElementType = "Liquid";
    static cursorProbability = 0.5;

	constructor(index) {
		super(index, {
            color: Acid.baseColor,
            elementType: Acid.baseElementType,
            density: 0.9,
			behaviours: [
                new AcidBehaviour({
                    acidPersistence: 0.4,
                }),
				new Moves({
					maxSpeed: 12,
					acceleration: 0.2,
				}),
			]
        });
	}
}


class Smoke extends Particle {
	static baseColor = new Color(0, 0, 50);
	static baseElementType = "Gas";
    static cursorProbability = 0.25;

	constructor(index) {
		super(index, {
            color: new Color(Smoke.baseColor.h, Smoke.baseColor.s, Smoke.baseColor.l),
            elementType: Smoke.baseElementType,
            density: -0.4,
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
					maxSpeed: 0.25,
					acceleration: -0.05,
				}),
                new MovesToSideRandomly(0.5)
			]
        });
	}
}

class Plant extends Particle {
	static baseColor = new Color(138, 100, 39);
	static baseElementType = "Solid";

	constructor(index) {
		super(index, {
            color: Plant.baseColor,
            elementType: Plant.baseElementType,
            density: 0.9,
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

class Drain extends Particle {
	static baseColor = new Color(250, 53, 36);
	static baseElementType = "Solid";

	constructor(index) {
		super(index, {
            color: Drain.baseColor,
            elementType: Drain.baseElementType,
            behaviours: [
                new DrainBehaviour(),
            ]
        });
	}
}

class Cloner extends Particle {
	static baseColor = new Color(56, 41, 58);
	static baseElementType = "Solid";

	constructor(index) {
		super(index, {
            color: Cloner.baseColor,
            elementType: Cloner.baseElementType,
            behaviours: [
                new ClonerBehaviour(),
            ]
        });
	}
}

class Liquifier extends Particle {
	static baseColor = new Color(180, 50, 50);
	static baseElementType = "Gas";
    static cursorProbability = 0.25;

	constructor(index) {
		super(index, {
            color: new Color(Liquifier.baseColor.h, Liquifier.baseColor.s, Liquifier.baseColor.l),
            elementType: Liquifier.baseElementType,
            density: -0.5,
			behaviours: [
				new Moves({
					maxSpeed: 0.25,
					acceleration: -0.05,
				}),
                new LiquifierBehaviour()
			]
        });
	}
}

class Solidifier extends Particle {
	static baseColor = new Color(270, 50, 50);
	static baseElementType = "Gas";

	constructor(index) {
		super(index, {
            color: new Color(Solidifier.baseColor.h, Solidifier.baseColor.s, Solidifier.baseColor.l),
            elementType: Solidifier.baseElementType,
            density: -0.5,
			behaviours: [
                new SolidifierBehaviour(),
                new Moves({
                    maxSpeed: 0.5,
                    acceleration: -0.01,
                }),
			]
        });
	}
}


export { Empty, Wall, Wood, Fuse, NaturalGas, Oil, Coal, Fire, Sand, Snow, Water, Acid, Smoke, Plant, Drain, Cloner, Steam, Liquifier, Solidifier };