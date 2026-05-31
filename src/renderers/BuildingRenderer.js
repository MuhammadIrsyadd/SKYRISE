export const BUILDING_TYPES = {
  RESIDENTIAL: 'RESIDENTIAL',
  OFFICE_BLUE: 'OFFICE_BLUE',
  OFFICE_EMERALD: 'OFFICE_EMERALD',
  OFFICE_RUBY: 'OFFICE_RUBY',
  HOTEL_GOLD: 'HOTEL_GOLD',
  HOTEL_WHITE: 'HOTEL_WHITE',
  MIXED_BRICK: 'MIXED_BRICK',
  MIXED_SLATE: 'MIXED_SLATE',
  BRUTALIST_DARK: 'BRUTALIST_DARK',
  MODERN_MINT: 'MODERN_MINT',
  MODERN_CHARCOAL: 'MODERN_CHARCOAL',
  MODERN_TERRACOTTA: 'MODERN_TERRACOTTA'
};

const PALETTE = {
  [BUILDING_TYPES.RESIDENTIAL]: { base: '#C4AF8A', detail: '#B09A74', accent: '#A88E68' },
  [BUILDING_TYPES.OFFICE_BLUE]: { base: '#1E3A5F', detail: '#162D4A', accent: '#4A8FBF' },
  [BUILDING_TYPES.OFFICE_EMERALD]: { base: '#064E3B', detail: '#065F46', accent: '#10B981' },
  [BUILDING_TYPES.OFFICE_RUBY]: { base: '#7F1D1D', detail: '#991B1B', accent: '#EF4444' },
  [BUILDING_TYPES.HOTEL_GOLD]: { base: '#EDE5D3', detail: '#C9A84C', accent: '#D4C5A0' },
  [BUILDING_TYPES.HOTEL_WHITE]: { base: '#F9FAFB', detail: '#E5E7EB', accent: '#D1D5DB' },
  [BUILDING_TYPES.MIXED_BRICK]: { base: '#991B1B', detail: '#7F1D1D', accent: '#B91C1C' },
  [BUILDING_TYPES.MIXED_SLATE]: { base: '#334155', detail: '#1E293B', accent: '#475569' },
  [BUILDING_TYPES.BRUTALIST_DARK]: { base: '#262626', detail: '#171717', accent: '#404040' },
  [BUILDING_TYPES.MODERN_MINT]: { base: '#D1FAE5', detail: '#A7F3D0', accent: '#6EE7B7' },
  [BUILDING_TYPES.MODERN_CHARCOAL]: { base: '#171717', detail: '#0A0A0A', accent: '#262626' },
  [BUILDING_TYPES.MODERN_TERRACOTTA]: { base: '#9A3412', detail: '#7C2D12', accent: '#C2410C' }
};

const WINDOW_COLORS = {
  LIT: '#FFE8A3', // Consistent warm interior light
  FRAME: 'rgba(0, 0, 0, 0.2)'
};

export class BuildingRenderer {
  static drawBlock(ctx, x, y, width, height, type, isFoundation = false, windowPattern = []) {
    const colors = PALETTE[type] || PALETTE[BUILDING_TYPES.RESIDENTIAL];
    
    // Draw Base
    ctx.fillStyle = colors.base;
    ctx.fillRect(x, y, width, height);

    // Draw Top/Bottom Trim
    ctx.fillStyle = colors.detail;
    ctx.fillRect(x, y, width, 4);
    ctx.fillRect(x, y + height - 2, width, 2);

    // Draw Windows
    this.drawWindows(ctx, x, y, width, height, type, colors, isFoundation, windowPattern);
  }

  static drawWindows(ctx, x, y, width, height, type, colors, isFoundation, windowPattern) {
    const margin = 8;
    const windowWidth = 12;
    const windowHeight = 16;
    
    const rows = 2;
    const cols = Math.floor((width - margin) / (windowWidth + 4));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = x + margin + (c * (windowWidth + 6));
        const wy = y + margin + (r * (windowHeight + 8));
        
        if (wx + windowWidth < x + width) {
          ctx.fillStyle = WINDOW_COLORS.LIT;
          ctx.fillRect(wx, wy, windowWidth, windowHeight);
          
          ctx.strokeStyle = WINDOW_COLORS.FRAME;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(wx, wy, windowWidth, windowHeight);
        }
      }
    }

    if (isFoundation) {
      const doorWidth = 24;
      const doorHeight = 32;
      ctx.fillStyle = colors.accent;
      ctx.fillRect(x + (width / 2) - (doorWidth / 2), y + height - doorHeight, doorWidth, doorHeight);
    }
  }
}
