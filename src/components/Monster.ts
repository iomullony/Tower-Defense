import MonsterPath from "./MonsterPath";

class Monster {
  position: { x: number; y: number };
  displayPosition: { x: number; y: number };
  lives: number;
  path: MonsterPath[];

  constructor(path: MonsterPath[]) {
    this.path = path;
    this.position = { ...path[0].position };
    this.displayPosition = { ...path[0].position };
    this.lives = 3; // Initial number of lives
  }

  // Implement Monster.update function
  update() {
    if (this.path.length === 0) {
      // Monster has reached the end of the path
      this.lives--; // Reduce lives
      return;
    }

    // Move to the next position in the path
    const nextPos = this.path.shift();
    if (nextPos) {
      this.position = { ...nextPos.position };
    }
  }

  // C. Create a Monster.display method
  display(context: CanvasRenderingContext2D, fieldSize: number) {
    context.fillStyle = 'purple'; // Color for the monster (you can change it)
    context.fillRect(
      this.position.x * fieldSize,
      this.position.y * fieldSize,
      fieldSize,
      fieldSize
    );
  }
}

export default Monster;
