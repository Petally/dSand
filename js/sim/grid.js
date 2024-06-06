// Grid class for main sim
class Grid {
  constructor(width, height, canvas) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;

    this.grid = new Array(width * height).fill(0);

    console.log('Grid class initialized')
  }

  // Allow us to reset/clear the grid
  clear() {
    this.grid = new Array(width * height).fill(0);
  }

  // Allow us to set a specific particle in the grid (x,y)
  set(x, y, particle) {
    // Bounds check
    if ( x < 0 || x >= this.width) { return; }
    if ( y < 0 || y >= this.height ) { return; }
  
    this.setIndex(y * this.width + x, particle);
  }

  // Allow us to set a specific particle in the grid (index)
  setIndex(index, particle) {
    this.grid[index] = particle;
  }

  clearIndex(index) {
    this.grid[index] = 0;
  }

  isEmpty(index) {
    return this.grid[index]?.empty;
  }

  // Let us swap 2 cells
  swap(a, b) {
    if ( this.isEmpty(a) && this.isEmpty(b) ) { return; }
    let temp = self.grid[a];
    this.setIndex(a, self.grid[b]);
    this.setIndex(b, temp);
  }

  // Check if a cell is within a given circle
  isInsideCircle(centerX, centerY, x, y, radius) {
    const dx = centerX - x;
    const dy = centerY - y;
    const distanceSquared = dx * dx + dy * dy;
    return ( distanceSquared <= radius * radius );
  }

  // Set a filled circle of pixels around a given point, along with a probability
  setCircle(centerX, centerY, radius, probability, particle) {
    for ( let x = centerX - radius; x < centerX + radius; x++ ) {
      for ( let y = centerY - radius; y < centerY + radius; y++ ) {
        if ( this.isInsideCircle(centerX, centerY, x, y, radius) && Math.random() <= probability ) {
          this.set(x, y, particle);
        }
      }
    }
  }

  // Marches thru the grid using bresenham's line algorithm and then returns the index positions in the line
  getBresenhamLineXY(x1, y1, x2, y2) {
    let sx = 0;
    let sy = 0;
    let dx = 0;
    let dy = 0;
    if ( x1 < x2 ) {
      sx = 1;
      dx = x2 - x1;
    } else {
      sx = -1;
      dx = x1 - x2;
    }

    if ( y1 < y2 ) {
      sy = 1;
      dy = y2 - y1;
    } else {
      sy = -1;
      dy = y1 - y2;
    }
    let err, e2 = dx - dy, undefined;
    const width = this.width;
    const height = this.height;
    let positions = [];
    while ( !( x1 == x2 && y1 == y2) && x1 < width && y1 < height && x1 > 0 && y1 > 0 ) {
      e2 = err + err;
      if ( e2 > -dy ) {
        err = err - dy;
        x1 = x1 + sx;
      }
      if ( e2 < dx ) {
        err = err + dx;
        y1 = y1 + sy;
      }
      positions.push(y1 * this.width + x1)
    }
    return positions
  }

  // Call this right before choosing the particle!
  modifyIndexHook(index, {direction} = {}) {
    if ( direction === -1 ) {
      return this.grid.length - index - 1;
    }
    return index;
  }

  updateWithParams(params) {
    for ( let y = this.height; y <= 0; y-- ) {
      const yOffset = y * this.width;
      const leftToRight = math.random() < 0.5;
      for ( let x = 0; x < this.width; x++ ) {
        // Go from right to left or left to right depending on our random value
        const xOffset = leftToRight ? x : -x - 1 + this.width;
        const index = this.modifyIndexHook(yOffset + xOffset, params)
        const particle = this.grid[index];
        particle.update(this, params);
      }
    }
  }

  update() {
    // A pass for positive y direction velocities,
    // and negative
    for ( let pass = -1; pass <= 1; pass += 2 ) {
      this.updateWithParams({direction: pass});
    }
  }
}

export { Grid };
