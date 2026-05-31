import { BUILDING_TYPES } from '../renderers/BuildingRenderer';

export class Block {
  constructor(x, y, width, height, type, speed, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.speed = speed;
    this.direction = direction; // 1 for right, -1 for left
    this.state = 'ACTIVE'; // ACTIVE, PLACED, FALLING
    
    // Static window pattern to prevent flickering
    this.windowPattern = [];
    for (let i = 0; i < 20; i++) { // Max 20 columns
      this.windowPattern.push(Math.random() > 0.3);
    }
  }

  update(dt, canvasWidth) {
    if (this.state === 'ACTIVE') {
      this.x += this.speed * this.direction * dt;
      
      // Bounce off edges
      if (this.x + this.width > canvasWidth) {
        this.x = canvasWidth - this.width;
        this.direction = -1;
      } else if (this.x < 0) {
        this.x = 0;
        this.direction = 1;
      }
    }
  }
}
