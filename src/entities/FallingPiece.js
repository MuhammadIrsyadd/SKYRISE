export class FallingPiece {
  constructor(x, y, width, height, type, vx) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.vx = vx;
    this.vy = 0;
    this.gravity = 500;
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 5;
  }

  update(dt) {
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.rotation += this.rotationSpeed * dt;
  }

  isOffScreen(canvasHeight, cameraY) {
    return this.y > canvasHeight - cameraY + 100;
  }
}
