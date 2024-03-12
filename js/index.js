// Main game script
// Imports
import { Grid } from './sim/grid.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let grid = new Grid(canvas.width, canvas.height, canvas);

// Main game and render loop
function tick(timeStamp) {
  window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
