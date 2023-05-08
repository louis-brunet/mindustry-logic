const _UTYPE_DEFAULT: UnitSymbol = getVar<UnitSymbol>('@new-horizon-pester');
const _IDLE_X_DEFAULT = Vars.thisx;
const _IDLE_Y_DEFAULT = Vars.thisy;
const _PID_DEFAULT = 2;
const _RADAR_NOT_FOUND = 0;

let PID = _PID_DEFAULT;
let idleX = _IDLE_X_DEFAULT;
let idleY = _IDLE_Y_DEFAULT;

const msgStd = getBuilding('message1');
const msgDebug = getBuilding('message2');
const cellTarget = getBuilding('cell1');
const memTarget = new Memory(cellTarget);

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
    print`PID=${PID}\n${count} units acted\n${UTYPE}`;
    printFlush(msgStd);

    unitBind(UTYPE);
} while (Vars.unit != startUnit);


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
        print`found target: [accent]${target}[]`;

        if (target.health <= 0) {
            print('\ntarget is [red]dead[]');

            unitControl.targetp({unit: Vars.unit, shoot: false});
        } else {
            print('\ntarget is [green]alive[]');
            
            goToLocation({ x: target.x, y: target.y, radius: Vars.unit.range - 1 });
            unitControl.targetp({unit: target, shoot: true});
        }

        printFlush(msgDebug);
    } else {
        // no enemies
        print`PID=${PID}\n`;
        print`${Vars.unit}@(${Math.floor(Vars.unit.x)}, ${Math.floor(Vars.unit.y)})\n`;
        
        // use radar processor
        if (cellTarget) {
            const [status, x, y] = memTarget;
            if (status !== _RADAR_NOT_FOUND) {
                print`using radar target [accent](${x}, ${y})[]`;
                
                goToLocation({x, y, radius: Vars.unit.range});
                unitControl.target({x, y, shoot: true});
            } else {
                print`no target found (${target})`;
            }
        } else {
            print`no target found (${target})`;
            unitControl.targetp({unit: Vars.unit, shoot: false});
            goToLocation({x: idleX, y: idleY, radius: Vars.unit.range});
        }
        printFlush(msgDebug);
        // mine ? 
    }
}
