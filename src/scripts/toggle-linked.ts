let toggle = getBuilding('switch1');
const enabled = toggle.enabled;

for (let i = 0; i < Vars.links; i++) {
    control.enabled(getLink(i), enabled);
}
