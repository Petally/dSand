// Grid class for main sim
class Grid {
  constructor(width, height, canvas) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;

    this.grid = new Array(width * height).fill(0);
  }

  // Allow us to reset/clear the grid
  clear() {
    this.grid = new Array(width * height).fill(0);
  }

  // Allow us to set a specific particle in the grid
  set(x, y, particle) {
    this.grid[y * this.width + x] = particle;
  }

  // Swap 2 particles or spaces
  swap(a, b) {
    // We could use array deconstructors to swap these
    // But this is easier to read
    const temp = this.grid[a];
    this.grid[a] = this.grid[b];
    this.grid[b] = temp;
  }

  // Check if a particle exists in a space
  isEmpty(index) {
    return this.grid[index] === 0;
  }
}

export { Grid };
