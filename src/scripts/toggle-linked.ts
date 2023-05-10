let toggle = getBuilding('switch1');
const enabled = toggle.enabled;

for (let i = 0; i < Vars.links; i++) {
    const linked = getLink(i);
    if (linked != toggle) {
        control.enabled(getLink(i), enabled);
    }
}
