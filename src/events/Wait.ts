import chalk from "chalk";
import { GameEvent } from "../components/EventManager";

export class Wait extends GameEvent {
  duration: number;
  constructor(duration: number) {
    super("wait");
    this.duration = duration;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      console.log(chalk.blue(`Waiting... this long ${this.duration} `));
      setTimeout(() => {
        resolve();
      }, this.duration);
    });
  }
}

export class BLWait extends GameEvent {
  duration: number;
  constructor(duration: number) {
    super("wait");
    this.duration = duration;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      console.log(chalk.red(`LOOP -Waiting... this long ${this.duration} `));
      setTimeout(() => {
        resolve();
      }, this.duration);
    });
  }
}
