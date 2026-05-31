export class ScoreManager {
  constructor() {
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('skyrise_highscore')) || 0;
    this.combo = 0;
  }

  addScore(accuracy) {
    let points = 0;
    if (accuracy === 'PERFECT') {
      this.combo++;
      points = 50 * this.getMultiplier();
    } else {
      this.combo = 0;
      if (accuracy === 'GREAT') points = 25;
      else if (accuracy === 'GOOD') points = 10;
    }

    this.score += points;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('skyrise_highscore', this.highScore);
    }

    return { points, combo: this.combo, multiplier: this.getMultiplier() };
  }

  getMultiplier() {
    if (this.combo >= 10) return 5;
    if (this.combo >= 5) return 3;
    if (this.combo >= 2) return 2;
    return 1;
  }

  reset() {
    this.score = 0;
    this.combo = 0;
  }
}
