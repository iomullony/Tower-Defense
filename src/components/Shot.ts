import Monster from "./Monster";

class Shot {
  position: { x: number; y: number };
  type: string;
  goal: Monster;

  constructor(position: { x: number; y: number }, type: string, goal: Monster) {
    this.position = position;
    this.type = type;
    this.goal = goal;
  }

  draw(context: CanvasRenderingContext2D, fieldSize: number) {
    context.beginPath();
    context.strokeStyle = 'yellow';
    context.lineWidth = 4;
    context.moveTo(this.position.x * fieldSize + fieldSize / 2, this.position.y * fieldSize + fieldSize / 2);
    context.lineTo(this.goal.position.x * fieldSize + fieldSize / 2, this.goal.position.y * fieldSize + fieldSize / 2);
    context.stroke();
  }
}

export default Shot;