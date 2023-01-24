"use strict";
class Grid {
	initialize(width, height) {
		this.width = width;
		this.height = height;
		this.grid = new Array(width * height).fill(0);
	}

	// Allow us to clear the canvas
	clear() {
		this.grid = new Array(this.width * this.height).fill(0);
	}

	// Allow us to set a specific particle
	set(x, y, color) {
		this.grid(y * this.width + x) = color;
	}

	// Allow us to swap two particles (or space)
	swap(a, b) {
		const temp = this.grid[a];
		this.grid[a] = this.grid[b];
		this.grid[b] = temp;
	}

	// Check if a particle exists in a space
	isEmpty(index) {
		return this.grid[index] === 0;
	}
}

// Main code
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mouse = {x: 0, y: 0, mouseDown: false};

//Capture inputs for the mouse
addEventListener("mousedown", e => {
	mouse.mouseDown = true;
});

addEventListener("mouseup", e => {
	mouse.mouseDown = false;
});

addEventListener("mousemove", e => {
	const rect = canvas.getBoundingClientRect();
	mouse.x = e.clientX - rect.left;
	mouse.y = e.clientY - rect.top;
	
});

//render everythin out, and step the sim
function render() {
	requestAnimationFrame(render);
};

requestAnimationFrame(render);

