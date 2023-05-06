let PID = 1;
let UTYPE: UnitSymbol = Units.poly; // getVar<UnitSymbol>('@new-horizon-gather');
const _UCOUNT = 5;
let UCOUNT = _UCOUNT;
const units = new DynamicArray<AnyUnit>(_UCOUNT);
let messageStatus = getBuilding('message1');
let messageDebug = getBuilding('message2');
let switchOnOff = getBuilding('switch1');

if (!switchOnOff.enabled) {
    endScript();
}

/** Setup :  bind and store units  */

print`initializing proc. PID = ${PID}, UTYPE=${UTYPE}\n`;

for (let i = 0; i < UCOUNT; i++) {
    unitBind(UTYPE);
    if (Vars.unit !== undefined) {
        if (Vars.unit.flag !== 0) {
            i--;
            continue;
        } 

        unchecked(units.push(Vars.unit));

        unitControl.flag(PID);
    }
}

print`Bound units : ${units.length}/${units.size}`;
printFlush(messageStatus);

/** Units are initialized */

while (switchOnOff.enabled) {
    for (let i = 0; i < units.length; i++) {
        print`Controlling unit ${i}\n`;
        
        tryAction(unchecked(units[i]), i);

        printFlush(messageDebug);
    }
}

/** Restore bound units ? */

for (let i = 0; i < units.length; i++) {
    unitBind(unchecked(units[i]));
    unitControl.flag(0);
}

endScript();


function tryAction (unit: AnyUnit, index: number) {
    print('todo : action ', unit, index);
}

