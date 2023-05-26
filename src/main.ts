import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Engine } from "@peasy-lib/peasy-engine";
import chalk from "chalk";

class EventManager {
  isCutscenePlaying: boolean = false;
  eventEngine: Engine | undefined;
  mode: EventConfigType = "CUTSCENE";
  sequence: Array<GameEvent> = [];
  loopIndex: number = 0;
  cutscenePromise: ((value: void | PromiseLike<void>) => void) | undefined;

  constructor(setmode: EventConfigType) {
    this.mode = setmode;
    this.loopIndex = 0;
    this.eventEngine = Engine.create({
      callback: this.behaviorLoop,
      ms: 200,
      started: false,
      resetThreshold: 10000,
      oneTime: true,
    });
    this.cutscenePromise = undefined;
  }

  loadSequence = (seq: GameEvent[]) => {
    this.sequence = [];
    this.sequence = [...seq];
    console.log(this.sequence);
  };

  pause = () => {
    if (this.eventEngine) this.eventEngine.pause();
  };

  start = (): Promise<void> | void => {
    if (this.eventEngine) this.eventEngine.start();
    if (this.mode == "CUTSCENE") {
      return new Promise(resolve => {
        this.cutscenePromise = resolve;
      });
    }
  };
  resume = () => {
    if (this.eventEngine) this?.eventEngine.start();
  };

  behaviorLoop = async (deltatime: number, now: number) => {
    if (this.isCutscenePlaying) return;
    if (this.sequence.length == 0) return;
    this.pause();
    await this.sequence[this.loopIndex].init();
    this.resume();
    this.loopIndex++;

    //check for end of sequence
    if (this.loopIndex >= this.sequence.length) {
      //check mode
      if (this.mode == "CUTSCENE") {
        this.eventEngine?.stop();
        this.sequence = [];
        if (this.cutscenePromise) this.cutscenePromise();
      }
      this.loopIndex = 0;
    }
  };
}

let myEM = new EventManager("CUTSCENE");
let myBL = new EventManager("LOOP");
const model = {
  toggleCutscene: async () => {
    myEM.loadSequence([
      new Log("start of cutscene", "blue"),
      new Walk(200, "up"),
      new Wait(2500),
      new Wait(5000),
      new Log("end of cutscene", "blue"),
    ]);
    myBL.isCutscenePlaying = true;
    myBL.pause();
    await myEM.start();
    myBL.resume();
    myBL.isCutscenePlaying = false;
  },
  startBL: () => {
    myBL.loadSequence([
      new Log("start of Behavior Loop", "red"),
      new BLWalk(500, "BL up"),
      new BLWait(2000),
      new BLWait(1200),
      new BLWalk(500, "BL down"),
      new Log("end of Behavior Loop", "red"),
    ]);
    myBL.start();
  },
};

const template = `<div> 
<div>
    <button \${click@=>toggleCutscene}>Run Cutscene</button>
    <button \${click@=>startBL}>Start Behavior Loop</button>
</div>

</div>`;
UI.create(document.body, model, template);

//library code
type EventConfigType = "LOOP" | "CUTSCENE";

class GameEvent {
  public name: string;
  constructor(eventName: string) {
    this.name = eventName;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      //do eventcode here
      resolve();
    });
  }
}
//user content
class Walk extends GameEvent {
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
class BLWalk extends GameEvent {
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

class Wait extends GameEvent {
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

class BLWait extends GameEvent {
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

class Alert extends GameEvent {
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

class Log extends GameEvent {
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
