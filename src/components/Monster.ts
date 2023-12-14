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

  update(elapsedTime: number, speed: number = 1) {
    if (this.path.length === 0) {
      // Monster reached the end
      this.lives--; // Deduct a life
      return;
    }

    const timeFraction = elapsedTime / 1000; // Convert elapsed time to seconds
    const currentPos = this.path[0];

    if (currentPos) {
      const { x, y } = currentPos.position;
      const nextPos = currentPos.nextPosition;

      if (nextPos) {
        // Update monster position based on elapsed time and speed
        this.position.x += (nextPos.x - x) * timeFraction * speed;
        this.position.y += (nextPos.y - y) * timeFraction * speed;

        // Check if the monster has reached the next position
        const distance = Math.sqrt(
          Math.pow(nextPos.x - this.position.x, 2) + Math.pow(nextPos.y - this.position.y, 2)
        );

        if (distance < 0.1) {
          // Remove the current position from the path
          this.path.shift();
        }
      }

      // Update display position if needed
      this.displayPosition = { ...this.position };
    }
  }

  display(context: CanvasRenderingContext2D, fieldSize: number) {
    const { x, y } = this.displayPosition;
    context.fillStyle = 'purple'; // Set the color as needed
    context.fillRect(x * fieldSize, y * fieldSize, fieldSize, fieldSize);
  }
}

export default Monster;
