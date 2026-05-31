export class GameLoop {
  constructor(update, draw) {
    this.update = update;
    this.draw = draw;
    this.lastTime = 0;
    this.accumulatedTime = 0;
    this.deltaTime = 1 / 60; // Target 60fps
    this.running = false;
    this.requestId = null;
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.requestId = requestAnimationFrame(this.loop.bind(this));
    }
  }

  stop() {
    this.running = false;
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
    }
  }

  loop(currentTime) {
    if (!this.running) return;

    const frameTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.accumulatedTime += frameTime;

    while (this.accumulatedTime >= this.deltaTime) {
      this.update(this.deltaTime);
      this.accumulatedTime -= this.deltaTime;
    }

    this.draw();

    this.requestId = requestAnimationFrame(this.loop.bind(this));
  }
}
