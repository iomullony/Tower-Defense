import MonsterPath from './MonsterPath';

class Monster {
  position: { x: number; y: number };
  displayPosition: { x: number; y: number };
  lives = 3;
  path: MonsterPath[];
  speed: number;
  originalSpeed: number;
  frozen: boolean;
  freezeTime: number;

  constructor(path: MonsterPath[], speed: number, lives: number) {
    this.position = { ...path[0].position };
    this.displayPosition = { ...path[0].position };
    this.lives = 3 + lives; // You can set the initial number of lives as needed
    this.path = path;
    this.speed = speed;
    this.originalSpeed = speed;
    this.frozen = false;
    this.freezeTime = 0;
  }

  update(elapsedTime: number) {  
   if  (this.frozen) {
      this.freezeTime -= elapsedTime;
      if (this.freezeTime <= 0) {
        this.frozen = false;
        // Restore original speed after freezing
        this.speed = this.originalSpeed;
      }
    } else {
      const currentPos = this.path[0];

      if (currentPos) {
        const { x, y } = currentPos.position;
        const nextPos = currentPos.nextPosition;
    
        if (nextPos) {
          // Calculate the distance the monster should move in this frame
          const distanceToMove = this.speed * (elapsedTime / 1000);
    
          // Calculate the angle to the next position
          const angle = Math.atan2(nextPos.y - y, nextPos.x - x);
    
          // Update monster position based on the calculated distance and angle
          this.position.x += Math.cos(angle) * distanceToMove;
          this.position.y += Math.sin(angle) * distanceToMove;
    
          // Check if the monster has reached the next position precisely
          const distance = Math.sqrt(
            Math.pow(nextPos.x - this.position.x, 2) + Math.pow(nextPos.y - this.position.y, 2)
          );
    
          if (distance <= distanceToMove) {
            // Set the position directly to the next position
            this.position = { ...nextPos };
            // Remove the current position from the path
            this.path.shift();
          }
        }
    
        // Update display position if needed
        this.displayPosition = { ...this.position };
      }
    }
  }
  
  display(context: CanvasRenderingContext2D, fieldSize: number) {
    const { x, y } = this.displayPosition;
    context.fillStyle = this.frozen ? 'lightblue' : 'purple';
    context.fillRect(x * fieldSize, y * fieldSize, fieldSize, fieldSize);
  }  

  hit(damage: number) {
    this.lives -= damage;
    if (this.lives <= 0) {
      // The monster is defeated, handle this as needed
      console.log('Monster defeated!');
    }
  }  

  freeze(time: number, slowFactor: number = 0.5) {
    if (!this.frozen) {
      this.frozen = true;
      this.freezeTime = time;
  
      // Save the original speed to restore after freezing
      this.originalSpeed = this.speed;
  
      // Slow down the monster when frozen
      this.speed *= slowFactor; // Adjust the factor as needed
    }
  } 

  endPosition() {
    return this.path[0].nextPosition === null;
  }
}

export default Monster;
