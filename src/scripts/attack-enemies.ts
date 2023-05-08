const _UTYPE_DEFAULT: UnitSymbol = getVar<UnitSymbol>('@new-horizon-pester');
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

function goToLocation ({x, y, radius}: {x: number, y: number, radius: number}) {
    const location = {x, y, radius}; // making compiler happy..
    if (!unitControl.within(location)) {
        unitControl.approach(location);
    }
}

function findTarget (): AnyUnit {
    let tmpTarget = unitRadar({ 
        filters: ["enemy", "any", "any"], 
        order: true, 
        sort: "distance" ,
    });
    if (!tmpTarget) {
        tmpTarget = radar({ 
            building: Vars.this,
            filters: ["enemy", "any", "any"], 
            order: true, 
            sort: "distance",
        })
    }
    return tmpTarget;
}

function unitAct () {
    unitControl.boost(true);
    
    const target = findTarget();
    if (target) {
        // found target enemy
        print`PID=${PID}\n`;
        print`${Vars.unit}@(${Math.floor(Vars.unit.x)}, ${Math.floor(Vars.unit.y)})\n`;
        print`found target: ${target}`;

        if (target.health <= 0) {
            print('\ntarget is dead');

            unitControl.targetp({unit: Vars.unit, shoot: false});
        } else {
            print('\ntarget is alive');
            
            goToLocation({ x: target.x, y: target.y, radius: Vars.unit.range - 1 });
            unitControl.targetp({unit: target, shoot: true});
        }

        printFlush(msgDebug);
    } else {
        // no enemies
        print`PID=${PID}\n`;
        print`${Vars.unit}@(${Math.floor(Vars.unit.x)}, ${Math.floor(Vars.unit.y)})\n`;
        print`no target found (${target})`;
        printFlush(msgDebug);

        unitControl.targetp({unit: Vars.unit, shoot: false});
        goToLocation({x: idleX, y: idleY, radius: Vars.unit.range});
        
        // mine ? 
    }
}
