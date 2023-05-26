import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import { EventManager } from "./components/EventManager";

import { Walk, BLWalk } from "./events/Walk";
import { Wait, BLWait } from "./events/Wait";
import { Log } from "./events/Log";
import { Alert } from "./events/Alert";

let myEM = new EventManager("CUTSCENE");
let myBL = new EventManager("LOOP");

const model = {
  toggleCutscene: async () => {
    myEM.loadSequence([
      new Log("start of cutscene", "blue"),
      new Walk(200, "up"),
      new Wait(2500),
      new Wait(2000),
      new Alert("about to end cutscene"),
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
