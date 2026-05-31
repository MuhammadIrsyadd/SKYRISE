import './style.css';
import { GameLoop } from './engine/GameLoop';
import { Camera } from './engine/Camera';
import { BlockManager } from './managers/BlockManager';
import { BuildingRenderer } from './renderers/BuildingRenderer';
import { SkyRenderer } from './renderers/SkyRenderer';
import { ScoreManager } from './managers/ScoreManager';
import { ParticleSystem } from './utils/ParticleSystem';
import { AudioEngine } from './engine/AudioEngine';

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.state = 'START';
    this.width = 0;
    this.height = 0;
    
    this.scoreManager = new ScoreManager();
    this.particleSystem = new ParticleSystem();
    this.audioEngine = new AudioEngine();
    this.camera = null;
    this.blockManager = null;
    this.skyRenderer = null;
    
    this.init();
    this.setupUI();
    this.bindEvents();
    
    this.loop = new GameLoop(this.update.bind(this), this.draw.bind(this));
    this.loop.start();
  }

  init() {
    this.resize();
    this.camera = new Camera(this.width, this.height);
    this.blockManager = new BlockManager(this.width, this.height);
    this.skyRenderer = new SkyRenderer(this.width, this.height);
    
    this.blockManager.onScore = (accuracy) => this.handleScore(accuracy);
    this.blockManager.onGameOver = () => this.handleGameOver();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(dpr, dpr);
    
    if (this.camera) {
      this.camera.width = this.width;
      this.camera.height = this.height;
    }
  }

  setupUI() {
    document.getElementById('best-score').textContent = this.scoreManager.highScore;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    
    const handleClick = () => {
      this.audioEngine.init();
      if (this.state === 'START') {
        this.startGame();
      } else if (this.state === 'PLAYING') {
        this.blockManager.placeBlock();
      }
    };

    window.addEventListener('mousedown', handleClick);
    window.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleClick();
    }, { passive: false });
    
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') handleClick();
    });

    document.getElementById('start-button').addEventListener('click', (e) => {
      e.stopPropagation();
      this.startGame();
    });

    document.getElementById('restart-button').addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetGame();
    });
  }

  startGame() {
    this.state = 'PLAYING';
    this.audioEngine.init();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    this.scoreManager.reset();
    this.updateUI();
  }

  resetGame() {
    this.state = 'PLAYING';
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    this.blockManager.init();
    this.scoreManager.reset();
    this.camera.y = 0;
    this.camera.targetY = 0;
    this.updateUI();
  }

  handleScore(accuracy) {
    const result = this.scoreManager.addScore(accuracy);
    this.updateUI();
    this.audioEngine.playPlace(accuracy);

    const lastBlock = this.blockManager.blocks[this.blockManager.blocks.length - 1];
    
    if (accuracy === 'PERFECT') {
      this.camera.shake(5);
      this.particleSystem.emit(lastBlock.x + lastBlock.width / 2, lastBlock.y, '#ffd700', 30);
    } else {
      this.camera.shake(10);
      this.particleSystem.emit(lastBlock.x + (accuracy === 'GREAT' ? lastBlock.width : 0), lastBlock.y, '#ffffff', 15);
    }
  }

  handleGameOver() {
    this.state = 'GAMEOVER';
    this.audioEngine.playGameOver();
    document.getElementById('hud').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');
    
    document.getElementById('final-floor').textContent = `${this.blockManager.blocks.length - 1} FLOORS`;
    document.getElementById('final-score').textContent = this.scoreManager.score;
    
    if (this.scoreManager.score >= this.scoreManager.highScore && this.scoreManager.score > 0) {
      document.getElementById('new-high-score').classList.remove('hidden');
    } else {
      document.getElementById('new-high-score').classList.add('hidden');
    }
    
    document.getElementById('best-score').textContent = this.scoreManager.highScore;
  }

  updateUI() {
    document.getElementById('score').textContent = this.scoreManager.score;
    document.getElementById('floor-count').textContent = `FLOOR ${this.blockManager.blocks.length}`;
    
    const comboBadge = document.getElementById('combo-badge');
    if (this.scoreManager.combo >= 2) {
      comboBadge.textContent = `${this.scoreManager.getMultiplier()}x COMBO`;
      comboBadge.classList.remove('hidden');
    } else {
      comboBadge.classList.add('hidden');
    }
  }

  update(dt) {
    if (this.state === 'PLAYING') {
      this.blockManager.update(dt, this.camera.y);
      this.camera.update(dt, this.blockManager.getTopY());
      this.particleSystem.update(dt);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw Sky
    this.skyRenderer.draw(this.ctx, this.blockManager.blocks.length, this.camera.y);
    
    this.camera.apply(this.ctx);
    
    // Draw Placed Blocks
    this.blockManager.blocks.forEach((block, index) => {
      BuildingRenderer.drawBlock(
        this.ctx,
        block.x,
        block.y,
        block.width,
        block.height,
        block.type,
        index === 0,
        block.windowPattern
      );
    });

    // Draw Falling Pieces
    this.blockManager.fallingPieces.forEach(piece => {
      this.ctx.save();
      this.ctx.translate(piece.x + piece.width / 2, piece.y + piece.height / 2);
      this.ctx.rotate(piece.rotation);
      BuildingRenderer.drawBlock(
        this.ctx,
        -piece.width / 2,
        -piece.height / 2,
        piece.width,
        piece.height,
        piece.type,
        false,
        [] // Optional for falling pieces
      );
      this.ctx.restore();
    });
    
    // Draw Active Block
    if (this.state === 'PLAYING' && this.blockManager.activeBlock) {
      const b = this.blockManager.activeBlock;
      BuildingRenderer.drawBlock(this.ctx, b.x, b.y, b.width, b.height, b.type, false, b.windowPattern);
    }

    // Draw Particles
    this.particleSystem.draw(this.ctx);
    
    this.camera.restore(this.ctx);
  }
}

new Game();
