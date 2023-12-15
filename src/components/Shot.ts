// 38553864

import Monster from "./Monster";
import Tower from "./Tower";

class Shot {
  position: { x: number; y: number };
  type: string;
  goal: Monster;
  tower: Tower;

  constructor(position: { x: number; y: number }, type: string, goal: Monster, tower: Tower) {
    this.position = position;
    this.type = type;
    this.goal = goal;
    this.tower = tower;
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
