import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Engine } from "@peasy-lib/peasy-engine";

class EventManager {
  static eventEngine: Engine | undefined;
  static mode: EventConfigType;
  static sequence: Array<GameEvent>;
  static loopIndex: number;
  static cutscenePromise: (value: void | PromiseLike<void>) => void;

  static init(setmode: EventConfigType) {
    EventManager.mode = setmode;
    EventManager.loopIndex = 0;
    EventManager.eventEngine = Engine.create({
      callback: EventManager.behaviorLoop,
      ms: 200,
      started: false,
      resetThreshold: 10000,
      oneTime: true,
    });
  }

  static loadSequence(seq: GameEvent[]) {
    EventManager.sequence = [...seq];
  }

  static pause() {
    if (EventManager.eventEngine) EventManager.eventEngine.pause();
  }

  static start(): Promise<void> | void {
    if (EventManager.eventEngine) EventManager.eventEngine.start();
    if (EventManager.mode == "CUTSCENE") {
      return new Promise(resolve => {
        EventManager.cutscenePromise = resolve;
      });
    }
  }
  static resume() {
    if (EventManager.eventEngine) EventManager?.eventEngine.start();
  }

  static async behaviorLoop(deltatime: number, now: number) {
    if (EventManager.sequence.length == 0) return;

    EventManager.pause();
    await EventManager.sequence[EventManager.loopIndex].init();
    EventManager.resume();
    EventManager.loopIndex++;

    //check for end of sequence
    if (EventManager.loopIndex >= EventManager.sequence.length) {
      //check mode
      if (EventManager.mode == "CUTSCENE") {
        EventManager.eventEngine = undefined;
        EventManager.sequence = [];
        EventManager.cutscenePromise();
      }
      EventManager.loopIndex = 0;
    }
  }
}

let myEM = EventManager;
let myBL = EventManager;
const model = {
  toggleCutscene: async () => {
    myEM.init("CUTSCENE");
    myEM.loadSequence([
      new Log("start of cutscene"),
      new Walk(200, "up"),
      new Wait(2500),
      new Alert("this is my alert"),
      new Wait(5000),
      new Log("end of cutscene"),
    ]);
    myBL.pause();
    await myEM.start();
    console.log("log =>resuming behaviorloop");
    myBL.resume();
  },
  startBL: () => {
    myBL.init("LOOP");
    myBL.loadSequence([
      new Log("start of Behavior Loop"),
      new Walk(500, "up"),
      new Wait(2000),
      new Wait(1200),
      new Walk(500, "down"),
      new Log("end of Behavior Loop"),
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
      console.log(`Im WALKING HERE, distance: ${this.distance}, in direction: ${this.direction} `);
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
      console.log(`Waiting... this long ${this.duration} `);
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
  constructor(message: string) {
    super("log");
    this.messsage = message;
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      console.log(this.messsage);
      resolve();
    });
  }
}
