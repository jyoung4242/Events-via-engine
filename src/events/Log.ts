import chalk from "chalk";
import { GameEvent } from "../components/EventManager";

export class Log extends GameEvent {
  messsage: string;
  color: string;
  constructor(message: string, color: "blue" | "red") {
    super("log");
    this.messsage = message;
    this.color = color;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      if (this.color == "red") console.log(chalk.red(this.messsage));
      else if (this.color == "blue") console.log(chalk.blue(this.messsage));
      resolve();
    });
  }
}
