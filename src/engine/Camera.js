export class Camera {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.y = 0;
    this.targetY = 0;
    this.lerpSpeed = 0.05;
    this.shakeAmount = 0;
  }

  update(dt, targetTopY) {
    // We want the top of the tower to be at roughly 2/3 of the screen height
    const desiredY = -(targetTopY - (this.height * 0.6));
    this.targetY = Math.max(0, desiredY);
    
    // Smooth follow
    this.y += (this.targetY - this.y) * this.lerpSpeed;

    if (this.shakeAmount > 0) {
      this.shakeAmount -= dt * 10;
      if (this.shakeAmount < 0) this.shakeAmount = 0;
    }
  }

  shake(amount) {
    this.shakeAmount = amount;
  }

  apply(ctx) {
    ctx.save();
    
    let sx = 0;
    let sy = 0;
    if (this.shakeAmount > 0) {
      sx = (Math.random() - 0.5) * this.shakeAmount;
      sy = (Math.random() - 0.5) * this.shakeAmount;
    }

    ctx.translate(sx, sy + this.y);
  }

  restore(ctx) {
    ctx.restore();
  }
}
