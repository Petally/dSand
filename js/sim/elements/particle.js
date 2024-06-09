// Base particle class
class Particle {
	constructor(index, {color, empty, behaviours, density, acidResistance, elementType} = {}) {
		this.index = index;
		this.color = color;
		this.empty = empty ?? false;
		this.behaviours = behaviours ?? [];
		this.updateBehavioursLookup();

		this.acidResistance = acidResistance ?? 1;
		this.density = density ?? 1;
		this.elementType = elementType;
	}

	update(grid, params) {
		this.behaviours.forEach(
			(b) => b.update(this, grid, params)
		);
	}

	updateBehavioursLookup() {
		this.behavioursLookup = Object.fromEntries(this.behaviours.map((b) => [b.constructor.name, b]));
	}

	getBehaviour(name) {
		return this.behavioursLookup[name];
	}

	addBehaviour(behaviour) {
		this.behaviours.push(behaviour);
		this.updateBehavioursLookup();
	}

	removeBehaviour(name) {
		this.behaviours = this.behaviours.filter((behaviour) => behaviour.constructor.name !== name);
		this.updateBehavioursLookup();
	}
}

export { Particle };