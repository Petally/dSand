import * as elements from './elements/elements.js';

// Grid class for main sim
class Grid {
  constructor(width, height, canvas) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;

    this.clear();

    this.rowCount = Math.floor(this.grid.length / this.width);
  
    console.log('Grid class initialized')
  }

  // Allow us to reset/clear the grid
  clear() {
    this.grid = new Array(this.width * this.height).fill(0).map((_, i) => new elements.Empty(i));
  }

  // Gets the particle at a given index
  getIndex(index) { 
    return this.grid[index];
  }

  // Allow us to set a specific particle in the grid (index)
  setIndex(index, particle) {
    if (index <= 0 || index >= this.grid.length) { return; }
    this.grid[index] = new particle(index);
  }

  // Allow us to set a specific particle in the grid (x,y)
  set(x, y, particle) {
    // Coordinate bounds check (prevent canvas wraparound)
    if (x < 0 || x >= this.width) { return; }
    if (y < 0 || y >= this.height) { return; }
    this.setIndex(y * this.width + x, particle);
  }

  clearIndex(index) {
    this.setIndex(index, elements.Empty);
  }

  isEmpty(index) {
    return this.getIndex(index)?.empty ?? false;
  }

  // Returns true if the given index can go to the next index
  canPassThrough(index, nextIndex) {
    // Check if in bounds
    if (nextIndex <= 0 || nextIndex >= this.grid.length) { return false; }
    if (this.isEmpty(nextIndex)) { return true; }
    if (!this.noWrap(index, nextIndex)) { return false; }

    const particle = this.getIndex(index);
    const nextParticle = this.getIndex(nextIndex);
    if (nextParticle.constructor?.elementType === 'Solid') { return false; }

    if (particle.constructor?.elementType === 'Powder') {
      return nextParticle.constructor?.elementType === 'Liquid' || nextParticle.constructor?.elementType === 'Gas';
    } else if (particle.constructor?.elementType === 'Liquid' || particle.constructor?.elementType === 'Gas') {
      return (particle.density > nextParticle.density && nextParticle.constructor?.elementType !== 'Powder');
    }
  }

  // Let us swap 2 cells
  swap(a, b) {
    if (this.isEmpty(a) && this.isEmpty(b)) { return; }
    let temp = this.grid[a];
    this.grid[a] = this.grid[b];
    this.grid[a].index = a;
    this.grid[b] = temp;
    this.grid[b].index = b;
  }

  // Returns true if the index doesn't wrap to the other side of the grid
  noWrap(oldIndex, newIndex) {
    return Math.abs(newIndex % this.width - oldIndex % this.width) <= 1;
  }

  // Check if a cell is within a given circle
  isInsideCircle(centerX, centerY, x, y, radius) {
    const dx = centerX - x;
    const dy = centerY - y;
    const distanceSquared = dx * dx + dy * dy;
    return (distanceSquared <= radius * radius);
  }

  // Set a filled circle of pixels around a given point, along with a probability
  setCircle(centerX, centerY, radius, probability = 1, particle) {
    // Don't set a circle if the xy coordinates are out of bounds. This prevents accidentally clicking *near* the canvas and setting pixels.
    if (centerX < 0 || centerX >= this.width) { return; }
    if (centerY < 0 || centerY >= this.width) { return; }
    for (let x = centerX - radius; x < centerX + radius; x++) {
      for (let y = centerY - radius; y < centerY + radius; y++) {
        if (this.isInsideCircle(centerX, centerY, x, y, radius) && Math.random() <= probability) {
          this.set(x, y, particle);
        }
      }
    }
  }

  // Marches thru the grid using bresenham's line algorithm and then returns the index positions in the line
  getBresenhamLineXY(x0, y0, x1, y1) {
    let positions = [];
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = Math.sign(x1 - x0);
    const sy = Math.sign(y1 - y0);
    let err = dx - dy;

    positions.push(y0 * this.width + x0);

    while (!(x0 === x1 && y0 === y1)) {
      const e2 = 2 * err;
      if (e2 > -dy) { 
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
      positions.push(y0 * this.width + x0);
    }

    return positions;
  }

  // Call this right before choosing the particle!
  modifyIndexHook(index, {direction} = {}) {
    if (direction === -1) {
      return this.grid.length - index - 1;
    }
    return index;
  }

  updateWithParams(params) {
    for (let row = this.rowCount - 1; row >= 0; row--) {
      const yOffset = row * this.width;
      const leftToRight = Math.random() < 0.5;
      for (let x = 0; x < this.width; x++) {
        // Go from right to left or left to right depending on our random value
        const xOffset = leftToRight ? x : -x - 1 + this.width;
        const index = this.modifyIndexHook(yOffset + xOffset, params)
        if (this.isEmpty(index)) { continue; }
        const particle = this.getIndex(index);
        particle.update(this, params);
      }
    }
  }

  update() {
    // A pass for positive y direction velocities,
    // and negative
    for (let pass = -1; pass <= 1; pass += 2) {
      this.updateWithParams({direction: pass});
    }
  }
}

export { Grid };
