const _UTYPE_DEFAULT: UnitSymbol = Units.alpha;
const _IDLE_X_DEFAULT = Vars.thisx;
const _IDLE_Y_DEFAULT = Vars.thisy;

let UTYPE: UnitSymbol = _UTYPE_DEFAULT;
let idleX = _IDLE_X_DEFAULT;
let idleY = _IDLE_Y_DEFAULT;

const switchOnOff = getBuilding('switch1');
if (!switchOnOff.enabled) {
    endScript();
}

unitBind(UTYPE);

const startUnit = Vars.unit;

do {
    if (!Vars.unit) break;
    unitAct();
    unitBind(UTYPE);
} while (Vars.unit != startUnit);

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