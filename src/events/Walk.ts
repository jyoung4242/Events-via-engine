import { GameEvent } from "../components/EventManager";
import chalk from "chalk";
//user content
export class Walk extends GameEvent {
  direction: string;
  distance: number;
  constructor(distance: number, direction: string) {
    super("walk");
    this.direction = direction;
    this.distance = distance;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      console.log(chalk.blue(`Im WALKING HERE, distance: ${this.distance}, in direction: ${this.direction} `));
      setTimeout(() => {
        resolve();
      }, 1000 + this.distance);
    });
  }
}

export class BLWalk extends GameEvent {
  direction: string;
  distance: number;
  constructor(distance: number, direction: string) {
    super("walk");
    this.direction = direction;
    this.distance = distance;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      console.log(chalk.red(`LOOP -> Im WALKING HERE, distance: ${this.distance}, in direction: ${this.direction} `));
      setTimeout(() => {
        resolve();
      }, 1000 + this.distance);
    });
  }
}
