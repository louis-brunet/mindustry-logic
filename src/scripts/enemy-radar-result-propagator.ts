let cellIn = getBuilding('cell1');
let cellOut = getBuilding('cell2');
const memIn = new Memory(cellIn);
const memOut = new Memory(cellOut);

const [status, x, y] = memIn;
memOut[0] = status;
memOut[1] = x;
memOut[2] = y;
