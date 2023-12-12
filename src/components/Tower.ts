class Tower {
  
  public type: String;
  public x: number;
  public y: number;

  constructor(type: string, x: number, y: number) {
    this.type = type;
    this.x = x;
    this.y = y;
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
  }
}

export default Tower;
