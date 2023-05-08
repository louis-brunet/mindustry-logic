let cellIn = getBuilding('cell1');
let cellOut = getBuilding('cell2');
let msgDebug = getBuilding('message1');

const memIn = new Memory(cellIn);
const memOut = new Memory(cellOut);

const [status, x, y] = memIn;
memOut[0] = status;
memOut[1] = x;
memOut[2] = y;

print`Wrote:\n`;
print`status=[accent]${status}[]\n`;
print`x=[accent]${x}[]\n`;
print`y=[accent]${y}[]`;
// print`(x, y)=[accent](${x}, ${y})[]\n`;
printFlush(msgDebug);
