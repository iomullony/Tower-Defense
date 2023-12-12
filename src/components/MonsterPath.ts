class MonsterPath {
    positions: { x: number; y: number }[];
  
    constructor(positions: { x: number; y: number }[]) {
      this.positions = positions;
    }
  
    getNextPosition(): { x: number; y: number } | undefined {
      return this.positions.shift();
    }
}

export default MonsterPath;
  