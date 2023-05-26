import { GameEvent } from "../components/EventManager";

export class Alert extends GameEvent {
  messsage: string;
  constructor(message: string) {
    super("alert");
    this.messsage = message;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      window.alert(this.messsage);
      resolve();
    });
  }
}
