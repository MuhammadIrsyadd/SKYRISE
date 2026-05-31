export class SkyRenderer {
  constructor(canvasWidth, canvasHeight) {
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.timeOfDay = 0; // 0 to 1
    
    this.palettes = [
      { floor: 1, colors: ['#FFDB99', '#FFB347'], name: 'Dawn' },
      { floor: 6, colors: ['#87CEEB', '#B0E2FF'], name: 'Morning' },
      { floor: 16, colors: ['#4DAEE3', '#87CEEB'], name: 'Midday' },
      { floor: 26, colors: ['#E8622A', '#FFB347'], name: 'Golden Hour' },
      { floor: 41, colors: ['#5C35A8', '#E8622A'], name: 'Dusk' },
      { floor: 60, colors: ['#0A0A20', '#1A1A30'], name: 'Night' }
    ];
  }

  getPalette(floor) {
    let current = this.palettes[0];
    for (const p of this.palettes) {
      if (floor >= p.floor) {
        current = p;
      } else {
        break;
      }
    }
    return current;
  }

  draw(ctx, floor, cameraY) {
    const palette = this.getPalette(floor);
    
    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, palette.colors[0]);
    gradient.addColorStop(1, palette.colors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // Parallax Skyline (Simplified)
    this.drawSkyline(ctx, floor, cameraY);
  }

  drawSkyline(ctx, floor, cameraY) {
    // Distant buildings
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    const parallax1 = cameraY * 0.1;
    for (let i = 0; i < 5; i++) {
      const h = 100 + (i * 30);
      const w = 80;
      ctx.fillRect((i * 120) % this.width, this.height - h + (parallax1 % 50), w, h);
    }

    // Closer buildings
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    const parallax2 = cameraY * 0.2;
    for (let i = 0; i < 4; i++) {
      const h = 150 + (i * 40);
      const w = 100;
      ctx.fillRect((i * 200 + 50) % this.width, this.height - h + (parallax2 % 80), w, h);
    }
  }
}
