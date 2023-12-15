class Tower {
  public type: string;
  public x: number;
  public y: number;
  public cooldown: number;
  public range: number;
  public maxCooldown: number;
  public upgradeLevel: number;

  constructor(type: string, x: number, y: number) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.maxCooldown = 50;
    this.cooldown = this.maxCooldown;
    this.range = 2;
    this.upgradeLevel = 1;
  }

  draw(context: CanvasRenderingContext2D, fieldSize: number) {
    // Choose different visualization based on the tower type
    switch (this.type) {
      case 'regular':
        context.fillStyle = 'green';
        break;
      case 'ice':
        context.fillStyle = 'blue';
        break;
      case 'fire':
        context.fillStyle = 'red';
        break;
      default:
        context.fillStyle = 'gray';
    }

    // Draw a simple rectangle representing the tower
    context.fillRect(this.x * fieldSize, this.y * fieldSize, fieldSize, fieldSize);

    // Draw the upgrade button
    context.fillStyle = 'yellow';
    context.fillRect(
      this.x * fieldSize + fieldSize / 2 - 10,
      this.y * fieldSize + fieldSize / 2 + 20,
      20,
      10
    );

    // Display the upgrade level
    context.fillStyle = 'black';
    context.font = '10px Arial';
    context.fillText(`Level ${this.upgradeLevel}`, this.x * fieldSize, this.y * fieldSize + fieldSize);

    // Draw a circle representing the attack range
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    context.lineWidth = 1;
    context.arc(
      this.x * fieldSize + fieldSize / 2,
      this.y * fieldSize + fieldSize / 2,
      this.range * fieldSize,
      0,
      2 * Math.PI
    );
    context.stroke();
  }
  updateCooldown() {
    this.cooldown = Math.max(0, this.cooldown - 1);
  }  
}

export default Tower;
