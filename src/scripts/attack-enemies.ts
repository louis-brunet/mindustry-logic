const _UTYPE_DEFAULT: UnitSymbol = Units.alpha;
const _IDLE_X_DEFAULT = Vars.thisx;
const _IDLE_Y_DEFAULT = Vars.thisy;
const _PID_DEFAULT = 2;

let PID = _PID_DEFAULT;
let idleX = _IDLE_X_DEFAULT;
let idleY = _IDLE_Y_DEFAULT;

const msgStd = getBuilding('message1');
const msgDebug = getBuilding('message2');

unitBind(_UTYPE_DEFAULT);
if (!Vars.unit) endScript();

let UTYPE: UnitSymbol = Vars.unit.type;// _UTYPE_DEFAULT;

const switchOnOff = getBuilding('switch1');
if (!switchOnOff.enabled) {
    print`PID=${PID} no switch enabled`;
    printFlush(msgStd);
    endScript();
}

unitBind(UTYPE);

let startUnit = Vars.unit;
if (!startUnit) {
    print`PID=${PID} no unit found`;
    printFlush(msgStd);
    endScript();
}

let count = 0;
do {
    if (!Vars.unit) break;
    if (Vars.unit.flag === 0) {
        unitControl.flag(PID);
    }
    if (Vars.unit.flag === PID) {
        unitAct();
        count++;
    }
    unitBind(UTYPE);
} while (Vars.unit != startUnit);

print`PID=${PID}\n${count} units acted\n${UTYPE}`;
printFlush(msgStd);

function unitAct () {
    const target = unitRadar({ 
        filters: ["enemy", "any", "any"], 
        order: true, 
        sort: "distance" 
    });
    if (target) {
        // found target enemy
        print`found target: ${target}`;
        printFlush(msgDebug);
        unitControl.approach({ x: target.x, y: target.y, radius: Vars.unit.range - 1 });
        unitControl.targetp({unit: target, shoot: true});
    } else {
        // no enemies
        print`no target found (${target})`;
        printFlush(msgDebug);
        unitControl.approach({x: idleX, y: idleY, radius: 10});
        
        // mine ? 
    }
}
