const _MAX_CAPACITY = 64;
const _DEFAULT_UCOUNT = 5;

let messageStatus = getBuilding('message1');
let messageDebug = getBuilding('message2');
let switchOnOff = getBuilding('switch1');

let PID = 1;
let UTYPE: UnitSymbol = getVar<UnitSymbol>('@new-horizon-gather');
let UCOUNT = _DEFAULT_UCOUNT;
let ITYPE: ItemSymbol = getVar<ItemSymbol>('@new-horizon-zeta');

const units = new DynamicArray<AnyUnit>(_MAX_CAPACITY);

if (!switchOnOff.enabled) {
    endScript();
}
if (UCOUNT > _MAX_CAPACITY) {
    print`Unit count (UCOUNT=${UCOUNT}) is too high !\nmax. ${_MAX_CAPACITY}`;
    printFlush(messageStatus);
    endScript();
}


/** Setup :  bind and store units  */

print`initializing proc. PID = ${PID}, UTYPE=${UTYPE}\n`;

for (let i = 0; i < UCOUNT; i++) {
    unitBind(UTYPE);
    if (Vars.unit !== undefined) {
        if (i > 0 && Vars.unit === units[0]) {
            break;
        }
        if (Vars.unit.flag !== 0) {
            i--;
            continue;
        } 

        units.push(Vars.unit);

        unitControl.flag(PID);
    }
}

print`Bound units : ${units.length}/${units.size}`;
printFlush(messageStatus);

/** Units are initialized */

while (switchOnOff.enabled) {
    for (let i = 0; i < units.length; i++) {
        print`Controlling unit ${i}\n`;
        
        unitBind(units[i]);
        tryAction(i);

        printFlush(messageDebug);
    }
}

/** Restore bound units */

for (let i = 0; i < units.length; i++) {
    unitBind(units[i]);
    unitControl.flag(0);
}

endScript();


function tryAction (index: number) {
    const { unit } = Vars;
    print('todo : action ', unit, index);

    if (unit.totalItems >= unit.itemCapacity) {
        // need to drop items in core
        const [found, coreX, coreY, coreBuilding] = unitLocate.building({group: "core", enemy: false});
        if (found) {
            unitControl.approach({x: coreX, y: coreY, radius: 5});
            unitControl.itemDrop(coreBuilding, 99999999);
        }
    } else {
        // can mine more items, look for desired item type
        const [found, oreX, oreY] = unitLocate.ore(ITYPE);
        if (found) {
            unitControl.approach({x: oreX, y: oreY, radius: 5});
            unitControl.mine(oreX, oreY);
            
        } else {
            // TODO
        }
    }
}

