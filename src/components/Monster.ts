import MonsterPath from './MonsterPath';

class Monster {
  position: { x: number; y: number };
  displayPosition: { x: number; y: number };
  lives: number;
  path: MonsterPath[];

  constructor(path: MonsterPath[]) {
    this.position = { ...path[0].position };
    this.displayPosition = { ...path[0].position };
    this.lives = 3; // You can set the initial number of lives as needed
    this.path = path;
  }

  update() {
    if (this.path.length === 0) {
      // Monster reached the end
      this.lives--; // Deduct a life
      return;
    }

    const nextPos = this.path.shift();
    if (nextPos) {
      console.log("Updating monster:", this.position, this.displayPosition);
      this.position = { ...nextPos.position };
      this.displayPosition = { ...nextPos.position }; 
    }
  }

  display(context: CanvasRenderingContext2D, fieldSize: number) {
    const { x, y } = this.displayPosition;
    context.fillStyle = 'purple'; // Set the color as needed
    context.fillRect(x * fieldSize, y * fieldSize, fieldSize, fieldSize);
  }
}

export default Monster;
