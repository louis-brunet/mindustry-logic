let cellIn = getBuilding('cell1');
let cellOut = getBuilding('cell2');
let msgDebug = getBuilding('message1');

const memIn = new Memory(cellIn);
const memOut = new Memory(cellOut);

const [status, x, y] = memIn;

print`Writing:\n`;
print`status=[accent]${status}[]\n`;

memOut[0] = status;
if (status !== 0) {
    print`x=[accent]${x}[]\n`;
    print`y=[accent]${y}[]`;

    memOut[1] = x;
    memOut[2] = y;
}

printFlush(msgDebug);
