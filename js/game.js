// Main game script
// TODO: Refactor all code, split up code into relevant ESModule files.
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

let selectedParticleClass = elements.Sand;
let penSize = 1;

const increaseBrushSizeButton = document.querySelector('#increaseBrushSizeButton');
const decreaseBrushSizeButton = document.querySelector('#decreaseBrushSizeButton');
const brushSizeLabel = document.querySelector('#brushSize');

function updateBrushSize(delta) {
	penSize = clamp(penSize + delta, 0, 16);
	brushSizeLabel.innerText = penSize;
}

increaseBrushSizeButton.addEventListener('click', e => {
	updateBrushSize(1);
});

decreaseBrushSizeButton.addEventListener('click', e => {
	updateBrushSize(-1);
});

// Make buttons depending on every elements in elements.js
Object.values(elements).forEach(e => {
	let btn = document.createElement('button');
	btn.innerText = e?.name ?? 'No name';

    const container = document.getElementById('buttonContainer');
	const baseColor = e.baseColor;
	btn.style.backgroundColor = "hsl(" + baseColor.h + ", " + baseColor.s + "%, " + baseColor.l + "%)";

	btn.addEventListener("click", () => {
		selectedParticleClass = e;
	});

	container.appendChild(btn);
});

// Prevent highlighting text if the mouse click started on the canvas
canvas.onselectstart = () => { return false; }

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
});

// Main game and render loop
function tick(timeStamp) {
  	// If the mouse is down then set particles
	const mouseIsInCanvas = (mouse.x >= 0 && mouse.x < grid.width && mouse.y >= 0 && mouse.y < grid.height)
	if (mouse.down && mouseIsInCanvas) {
		const linePositions = grid.getBresenhamLineXY(oldMousePos.x, oldMousePos.y, mouse.x, mouse.y);
		for (let i = 0; i < linePositions.length; i++) {
			if (penSize == 0) {
				grid.setIndex(linePositions[i], selectedParticleClass);
			} else {
				grid.setCircle(Math.floor(linePositions[i] % grid.height), Math.floor(linePositions[i] / grid.width), penSize, selectedParticleClass.cursorProbability, selectedParticleClass);
			}
		}
	}

	oldMousePos.x = clamp(mouse.x, 0, grid.width - 1);
	oldMousePos.y = clamp(mouse.y, 0, grid.height - 1);

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
