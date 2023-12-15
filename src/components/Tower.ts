// 38553864

class Tower {
  public type: string;
  public x: number;
  public y: number;
  public cooldown: number;
  public range: number;
  public maxCooldown: number;
  public upgradeLevel: number;
  public damage: number;
  public freezeDuration: number;
  public freezeFactor: number;

  constructor(type: string, x: number, y: number) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.maxCooldown = 50;
    this.cooldown = this.maxCooldown;
    this.range = 2;
    this.upgradeLevel = 1;
    this.freezeDuration = 1000;
    this.freezeFactor = 0.5;

    switch (type) {
      case 'regular':
        this.damage = 1;
        break;
      case 'ice':
        this.damage = 0.5;
        break;
      case 'fire':
        this.damage = 2;
        break;
      default:
        this.damage = 1;
    }
  }

  draw(context: CanvasRenderingContext2D, fieldSize: number) {
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

    // Rrectangle representing the tower
    context.fillRect(this.x * fieldSize, this.y * fieldSize, fieldSize, fieldSize);

    // Upgrade button
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
    context.fillText(`Lvl. ${this.upgradeLevel}`, this.x * fieldSize, this.y * fieldSize + fieldSize);

    // Attack range
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

  getDamage(): number {
    return this.damage + this.upgradeLevel - 1;
  }
}

export default Tower;
