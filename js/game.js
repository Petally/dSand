// Main game script
// Imports
import { Grid } from './sim/grid.js';
import { clamp } from './util/clamp.js';

import * as elements from './sim/elements/elements.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let image = ctx.createImageData(canvas.width, canvas.height);
let imageData = image.data;

let mouse = {x: 0, y: 0, down: false};
let oldMousePos = {x: 0, y: 0};
const grid = new Grid(canvas.width, canvas.height, canvas);

let currentParticleClass = elements.Sand;

console.log();
// Make buttons depending on every elements in elements.js
Object.values(elements).forEach(e => {
	let btn = document.createElement('button');
	btn.innerHTML = e?.name ?? 'No name';

    const container = document.getElementById('buttonContainer');
	const baseColor = e.baseColor;
	btn.style.backgroundColor = "hsl(" + baseColor.h + ", " + baseColor.s + "%, " + baseColor.l + "%)";

	btn.addEventListener("click", () => {
		currentParticleClass = e;
	});

	container.appendChild(btn);
});

//Capture inputs for the mouse
addEventListener("mousedown", e => {
	mouse.down = true;
});

addEventListener("mouseup", e => {
	mouse.down = false;
});

addEventListener("mousemove", e => {
	const rect = canvas.getBoundingClientRect();
	mouse.x = Math.floor((e.clientX - rect.left) / (rect.right - rect.left) * canvas.width);
	mouse.y = Math.floor((e.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height);

	// Clamp mouse positions to canvas/grid boundaries
	mouse.x = clamp(mouse.x, 0, grid.width - 1);
	mouse.y = clamp(mouse.y, 0, grid.height - 1);
});

// Main game and render loop
function tick(timeStamp) {
  	// If the mouse is down then set particles
	if (mouse.down) {
		const linePositions = grid.getBresenhamLineXY(oldMousePos.x, oldMousePos.y, mouse.x, mouse.y);
		console.log(linePositions);
		for (let i = 0; i < linePositions.length; i++) {
			grid.setCircle(Math.floor(linePositions[i] % grid.height), Math.floor(linePositions[i] / grid.width), 8, currentParticleClass.cursorProbability, currentParticleClass);
		}
	}

	oldMousePos.x = mouse.x;
	oldMousePos.y = mouse.y;

	// Update the grid
	grid.update();

	// Clear the canvas
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Draw the entire grid
	grid.grid.forEach((particle, index) => {
		const i = index * 4;
		const c = particle?.color.toRGB() ?? [0, 0, 0];
		imageData[i + 0] = c[0];
		imageData[i + 1] = c[1];
		imageData[i + 2] = c[2];
		imageData[i + 3] = 255;
	});

  // Render to canvas
	ctx.putImageData(image, 0, 0);

	requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
