const PID = 1;
const UTYPE: UnitSymbol = Units.poly; // getVar<UnitSymbol>('@new-horizon-gather');
const UCOUNT = 5;
const messageStatus = getBuilding('message1');
const messageDebug = getBuilding('message2');

/** Setup :  bind and store units  */

print`initializing proc. PID = ${PID}, UTYPE=${UTYPE}\n`;
const units = new DynamicArray<AnyUnit>(UCOUNT);

for (let i = 0; i < UCOUNT; i++) {
    unitBind(UTYPE);
    if (Vars.unit !== undefined) {
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

while (true) {
    for (let i = 0; i < units.length; i++) {
        print`Controlling unit ${i}`;
        printFlush(messageDebug);

        tryAction(units[i], i);
    }
}

/** Restore bound units ? */

for (let i = 0; i < units.length; i++) {
    unitBind(units[i]);
    unitControl.flag(0);
}

endScript();


function tryAction (unit: AnyUnit, index: number) {
    print('todo : action ', unit, index);
}

