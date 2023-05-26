import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { Engine } from "@peasy-lib/peasy-engine";

const model = {
  toggleCutscene: () => {
    myEM.start();
    console.log("starting EM");
  },
};

const template = `<div> 
<div>
    <button \${click@=>toggleCutscene}>Run Cutscene</button>
</div>

</div>`;
UI.create(document.body, model, template);

//library code
type EventConfigType = "LOOP" | "ONESHOT";

class EventManager {
  static eventEngine: Engine;
  static mode: EventConfigType;
  static sequence: Array<GameEvent>;
  static loopIndex: number;

  static init(setmode: EventConfigType) {
    EventManager.mode = setmode;
    EventManager.loopIndex = 0;
    EventManager.eventEngine = Engine.create({ callback: EventManager.behaviorLoop, fps: 10, started: false });
  }

  static loadSequence(seq: GameEvent[]) {
    EventManager.sequence = [...seq];
  }

  static pause() {
    EventManager.eventEngine.pause();
  }

  static start() {
    EventManager.eventEngine.start();
  }
  static resume() {
    EventManager.eventEngine.start();
  }

  static async behaviorLoop(deltatime: number, now: number) {
    await EventManager.sequence[EventManager.loopIndex].init();
    EventManager.loopIndex++;
    console.log(EventManager.loopIndex);

    //check for end of sequence
    if (EventManager.loopIndex == EventManager.sequence.length) {
      //check mode
      if (EventManager.mode == "ONESHOT") EventManager.eventEngine.stop();
      EventManager.loopIndex = 0;
    }
  }
}

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
      }, 3000 + this.distance);
    });
  }
}

//main code
const myEM = EventManager;
console.log("created EM");

myEM.init("LOOP");
console.log("initialized EM");
myEM.loadSequence([new Walk(200, "up"), new Walk(800, "down"), new Walk(500, "left"), new Walk(1000, "right")]);
console.log("loaded sequence");
