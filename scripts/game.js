"use strict";
class Particle {
	constructor({color, empty} = {}) {
		this.color = color;
		this.empty = empty ?? false;
		this.updated = false;
 	}
}

class Sand extends Particle {
	static baseColor = "yellow";
	constructor() {
		super({color: Sand.baseColor});
	}
}

class Empty extends Particle {
	static baseColor = "black";
	constructor() {
		super({color: Empty.baseColor, empty: true});
	}
}

class Grid {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.clear();
		console.log("initialized grid");
	}

	// Allow us to clear the canvas, fill all elements with empty
	clear() {
		this.grid = new Array(this.width * this.height).fill(0).map(() => new Empty());
		console.log("cleared");
	}

	index(x, y) {
		return y * this.width + x;
	}

	setIndex(i, particle) {
		this.grid[i] = particle;
		this.grid[i].updated = true;
	}

	clearIndex(i) {
		this.setIndex(i, new Empty());
	}

	// Allow us to set a specific particle
	set(x, y, particle) {
		const index = this.index(x, y);
		//Bounds check
		if (x < 0 || x >= this.width) return -1;
		if (y < 0 || y >= this.height) return -1;
		this.setIndex(index, particle);
	}

	// Allow us to swap two particles (or space)
	swap(a, b) {
		const temp = this.grid[a];
		this.grid[a] = this.grid[b];
		this.setIndex(a, this.grid[b]);
		this.setIndex(b, temp);
	}

	// Check if a particle exists in a space, if out of bounds
	isEmpty(index) {
		return this.grid[index]?.empty ?? false;
	}

	updatePixel(i) {
		const below = i + this.width;
		const belowLeft = below - 1;
		const belowRight = below + 1;

		if (this.isEmpty(below)) {
			this.swap(i, below);
		} else if (this.isEmpty(belowLeft)) {
			this.swap(i, belowLeft);
		} else if (this.isEmpty(belowRight)) {
			this.swap(i, belowRight);
		}
	}

	update() {
		this.grid.forEach(e => {
			e.updated = false;
		});

		for (let i = 0; i < this.grid.length; i++) {
			if (this.grid[i].updated === false) {
				this.updatePixel(i);
			}
			ctx.fillStyle = this.grid[i].color;
			ctx.fillRect((i % this.width) * SCALE, Math.floor(i / this.height) * SCALE, SCALE, SCALE);
		}
	}
}

// Main code
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const WIDTH = 128;
const HEIGHT = 128;
const SCALE = 4;

const mouse = {x: 0, y: 0, mouseDown: false};
const grid = new Grid(WIDTH, HEIGHT);

//Capture inputs for the mouse
addEventListener("mousedown", e => {
	mouse.mouseDown = true;
});

addEventListener("mouseup", e => {
	mouse.mouseDown = false;
});

addEventListener("mousemove", e => {
	const rect = canvas.getBoundingClientRect();
	mouse.x = Math.floor((e.clientX - rect.left) / SCALE);
	mouse.y = Math.floor((e.clientY - rect.top) / SCALE);
});

//render everythin out, and step the sim
function render() {
	//clear the canvas
	ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

	if (mouse.mouseDown) {
		grid.set(Math.floor(mouse.x), Math.floor(mouse.y), new Sand());
		console.log(`set pixel at ${Math.floor(mouse.x)}, ${Math.floor(mouse.y)}`);
		console.log(grid.grid[grid.index(Math.floor(mouse.x), Math.floor(mouse.y))])
	}
	grid.update();

	requestAnimationFrame(render);
};

requestAnimationFrame(render);

