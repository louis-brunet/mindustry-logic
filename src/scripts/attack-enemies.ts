const _UTYPE_DEFAULT: UnitSymbol = Units.alpha;
const _IDLE_X_DEFAULT = Vars.thisx;
const _IDLE_Y_DEFAULT = Vars.thisy;
const _PID_DEFAULT = 2;

let PID = _PID_DEFAULT;

unitBind(_UTYPE_DEFAULT);
if (!Vars.unit) endScript();

let UTYPE: UnitSymbol = Vars.unit.type;// _UTYPE_DEFAULT;
let idleX = _IDLE_X_DEFAULT;
let idleY = _IDLE_Y_DEFAULT;

const switchOnOff = getBuilding('switch1');
if (!switchOnOff.enabled) {
    endScript();
}

unitBind(UTYPE);

let startUnit = Vars.unit;
if (!startUnit) {
    endScript();
}

let count = 0;
do {
    if (!Vars.unit) break;
    if (Vars.unit.flag !== 0) {
        unitControl.flag(PID);
        unitAct();
        count++;
    }
    unitBind(UTYPE);
} while (Vars.unit != startUnit);

print`Unit count: ${count}\n${UTYPE}`;
printFlush()

function unitAct () {
    const target = unitRadar({ 
        filters: ["enemy", "any", "any"], 
        order: true, 
        sort: "distance" 
    });
    if (target) {
        // found target enemy
        unitControl.approach({ x: target.x, y: target.y, radius: Vars.unit.range - 1 });
        unitControl.targetp({unit: target, shoot: true});
    } else {
        // no enemies
        unitControl.approach({x: idleX, y: idleY, radius: 10});
        
        // mine ? 
    }
}