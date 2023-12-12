import MonsterPath from './MonsterPath';

class Monster {
  position: { x: number; y: number };
  displayPosition: { x: number; y: number };
  lives: number;
  path: MonsterPath;

  constructor(position: { x: number; y: number }, path: MonsterPath, lives: number = 3) {
    this.position = position;
    this.displayPosition = { ...position }; // Initialize displayPosition with the starting position
    this.lives = lives;
    this.path = path;
  }

  update(deltaTime: number) {
    // Update displayPosition to the next position in the MonsterPath
    const nextPosition = this.path.getNextPosition();
    if (nextPosition) {
      this.displayPosition = { ...nextPosition };
    }
  }

  display(context: CanvasRenderingContext2D, fieldSize: number) {
    // Visualize the monster using a rectangle with a color different from the towers
    context.fillStyle = 'purple';
    context.fillRect(
      this.displayPosition.x * fieldSize,
      this.displayPosition.y * fieldSize,
      fieldSize,
      fieldSize
    );
  }
}

export default Monster;
