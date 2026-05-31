import { Block } from '../entities/Block';
import { FallingPiece } from '../entities/FallingPiece';
import { BUILDING_TYPES } from '../renderers/BuildingRenderer';

export class BlockManager {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.blocks = [];
    this.fallingPieces = [];
    this.activeBlock = null;
    this.blockHeight = 60;
    this.baseWidth = 200;
    this.currentSpeed = 200;
    this.currentDistrictType = BUILDING_TYPES.RESIDENTIAL;
    this.districtSize = 8; // Floors per architectural style
    this.onGameOver = null;
    this.onScore = null;
    this.init();
  }

  init() {
    this.blocks = [];
    this.fallingPieces = [];
    this.currentDistrictType = BUILDING_TYPES.RESIDENTIAL;
    // ... rest of init

    const foundation = new Block(
      (this.canvasWidth - this.baseWidth) / 2,
      this.canvasHeight - this.blockHeight - 20,
      this.baseWidth,
      this.blockHeight,
      BUILDING_TYPES.MODERN_CHARCOAL,
      0,
      0
    );
    foundation.state = 'PLACED';
    this.blocks.push(foundation);
    this.spawnBlock();
  }

  spawnBlock() {
    const lastBlock = this.blocks[this.blocks.length - 1];
    const floor = this.blocks.length;
    
    // Calculate speed based on floor
    const baseSpeed = 200;
    const speedIncrement = 15; 
    const maxSpeed = 800;
    this.currentSpeed = Math.min(baseSpeed + (floor * speedIncrement), maxSpeed);

    // INDIVIDUAL RANDOMIZATION: Every floor gets a new random style
    const types = Object.values(BUILDING_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];

    this.activeBlock = new Block(
      Math.random() > 0.5 ? 0 : this.canvasWidth - lastBlock.width,
      lastBlock.y - this.blockHeight,
      lastBlock.width,
      this.blockHeight,
      randomType,
      this.currentSpeed,
      Math.random() > 0.5 ? 1 : -1
    );
  }

  placeBlock() {
    if (!this.activeBlock) return;

    const lastBlock = this.blocks[this.blocks.length - 1];
    const diff = this.activeBlock.x - lastBlock.x;
    const absDiff = Math.abs(diff);

    // Accuracy Check
    let accuracy = 'MISS';
    if (absDiff <= 12) accuracy = 'PERFECT';
    else if (absDiff <= 24) accuracy = 'GREAT';
    else if (absDiff <= 40) accuracy = 'GOOD';

    if (absDiff >= lastBlock.width) {
      // Complete Miss
      this.onGameOver?.();
      return;
    }

    // Trim Block
    if (accuracy === 'PERFECT') {
      // Snap to last block for perfect alignment
      this.activeBlock.x = lastBlock.x;
    } else {
      // Create Falling Piece
      const fallingWidth = absDiff;
      let fallingX = 0;
      if (diff > 0) {
        // Falling piece is on the right
        fallingX = this.activeBlock.x + (lastBlock.width - absDiff);
      } else {
        // Falling piece is on the left
        fallingX = this.activeBlock.x - absDiff;
      }

      this.fallingPieces.push(new FallingPiece(
        fallingX,
        this.activeBlock.y,
        fallingWidth,
        this.activeBlock.height,
        this.activeBlock.type,
        diff * 2
      ));

      // Calculate new width
      const newWidth = lastBlock.width - absDiff;
      
      if (newWidth < this.baseWidth * 0.15) {
        this.onGameOver?.();
        return;
      }

      if (diff > 0) {
        // Overhang on the right, trim from right
        this.activeBlock.width = newWidth;
      } else {
        // Overhang on the left, trim from left
        this.activeBlock.x = lastBlock.x;
        this.activeBlock.width = newWidth;
      }
    }

    this.activeBlock.state = 'PLACED';
    this.blocks.push(this.activeBlock);
    
    this.onScore?.(accuracy);
    this.spawnBlock();
  }

  update(dt, cameraY) {
    if (this.activeBlock) {
      this.activeBlock.update(dt, this.canvasWidth);
    }

    for (let i = this.fallingPieces.length - 1; i >= 0; i--) {
      this.fallingPieces[i].update(dt);
      if (this.fallingPieces[i].isOffScreen(this.canvasHeight, cameraY)) {
        this.fallingPieces.splice(i, 1);
      }
    }
  }

  getTopY() {
    if (this.blocks.length === 0) return this.canvasHeight;
    return this.blocks[this.blocks.length - 1].y;
  }
}
