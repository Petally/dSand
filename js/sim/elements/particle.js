// Base particle class
class Particle {
	constructor(index, {color, empty, behaviours, density, acidResistance} = {}) {
		this.index = index;
		this.color = color;
		this.empty = empty ?? false;
		this.behaviours = behaviours ?? [];
		this.behavioursLookup = Object.fromEntries(this.behaviours.map((b) => [b.constructor.name, b]));

		this.acidResistance = acidResistance ?? 1;
		this.density = density ?? 1;
	}

	update(grid, params) {
		this.behaviours.forEach(
			(b) => b.update(this, grid, params)
		);
	}

	getBehaviour(name) {
		return this.behavioursLookup[name];
	}
}

export { Particle };