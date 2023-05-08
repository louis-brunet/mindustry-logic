const _STATUS_NOT_FOUND = 0;
const _STATUS_FOUND_SELF = 1;
const _STATUS_FOUND_NEIGHBOR = 2; // TODO multiple radars

const msgStd = getBuilding('message1');
const cellResult = getBuilding('cell1');
const memResult = new Memory(cellResult);

const target = findTarget();

if (target) {
    memResult[0] = _STATUS_FOUND_SELF;
    memResult[1] = target.x;
    memResult[2] = target.y;

    print`Status: [green]${memResult[0]} FOUND[]\n`;
    print`Target\n`;
    print`[accent](${Math.floor(target.x)}, ${Math.floor(target.y)})[]\n`;
    print`${target}`;
    printFlush(msgStd);
} else {
    print`Status: [red]${memResult[0]} NOT FOUND[]`;
    printFlush(msgStd);
    memResult[0] = _STATUS_NOT_FOUND;
}




function findTarget (): AnyUnit {
    // self radar
    let target = radar({
        building: Vars.this,
        filters: ["enemy", "any", "any"], 
        order: true, 
        sort: "distance",
    });

    // use linked buildings as radar
    for (let i = 0; i < Vars.links && !target; i++) {
        const building = getLink(i);
        const buildingRadar = radar({
            building,
            filters: ["enemy", "any", "any"], 
            order: true, 
            sort: "distance",
        });

        target = buildingRadar;
    }

    return target;
}

